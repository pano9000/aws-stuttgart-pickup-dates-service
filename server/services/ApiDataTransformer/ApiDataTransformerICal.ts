import type { AwsApiServiceResponseAll, AwsApiServiceEventTypeName, AwsApiServiceEventScheduleName, AwsApiServiceEvent } from "../AwsApiService"
import type getTranslation from "~/server/utils/getTranslation"
import type { IApiDataTransformer } from "./IApiDataTransformer";
import type { ICalCalendar, ICalEvent, ICalEventTransparency } from 'ical-generator';
import type { DateTime } from "luxon";

export class ApiDataTransformerICal implements IApiDataTransformer {
  private di: ApiDataTransformerICalDI;

  private apiData: AwsApiServiceResponseAll;
  private options?: ApiDataTransformerICalOptions;
  private calendar: ICalCalendar;

  constructor(
    di: ApiDataTransformerICalDI,
    apiData: AwsApiServiceResponseAll, 
    options?: ApiDataTransformerICalOptions
  ) {
    this.di = di;
    this.apiData = apiData;
    this.options = options
    this.calendar = this.createCalendar();
  }


  private createCalendar() {
    return new this.di.ICalCalendar({
      name: `Abfallwirtschaft Stuttgart Collections ${this.apiData.information.streetname} ${this.apiData.information.streetno}`,
      timezone: "Europe/Berlin"
    });
  }


  private getEventDate(dateString: string, time: HourMinuteTuple) {
    const date = this.di.DateTime.fromISO(dateString, {zone: "Europe/Berlin"}).set({hour: time[0], minute: time[1]});
    if (!date.isValid) throw new Error("Unable to create a valid date")

    if (this.options?.offsetEvent && this.options.offsetEvent > 0) {
      return date.minus({ days: this.options.offsetEvent})
    }

    return date
  }


  private getEventSummary(eventType: AwsApiServiceEventTypeName, eventSchedule: AwsApiServiceEventScheduleName) {
    const translatedEventType = this.di.getTranslation(this.options?.translated, `waste_${eventType}`) || eventType;
    const translatedEventSchedule = this.di.getTranslation(this.options?.translated, `schedule_${eventSchedule}`) || eventSchedule;

    if (this.options?.customSummary) {
      //@TODO: strip any html? or vcalendar tags
      return this.options.customSummary.replaceAll("%1", translatedEventType).replaceAll("%2", translatedEventSchedule);
    }

    const translatedPickup = this.di.getTranslation(this.options?.translated, `term_pickup`) || "Pickup";
    const translatedOffset = (this.options?.offsetEvent) ? this.di.getTranslation(this.options?.translated, `term_offset`) || "Offset" : ''

    return `${translatedPickup} ${translatedEventType} (${translatedEventSchedule})${translatedOffset}`
  }

  private addEvent(event: AwsApiServiceEvent) {
    const currentEvent = this.calendar.createEvent({
      start: this.getEventDate(event.date, this.options?.startTime || [6, 30]),
      end: this.getEventDate(event.date, this.options?.endTime || [7, 0]),
      summary: this.getEventSummary(event.type, event.schedule),
      //description: `AWS Pickup ${event.type} (${event.schedule}) ${(options?.offsetEvent) ? 'offset' : ''}`,
      location: `${this.apiData.information.streetname} ${this.apiData.information.streetno}`,
      transparency: this.di.ICalEventTransparency.TRANSPARENT,
      allDay: this.options?.allDay
    })

    return currentEvent;


    }

  private setEventAlarm(iCalEvent: ICalEvent) {
    if (this.options?.alarm && Number.isInteger(this.options.alarm)) {
      iCalEvent.createAlarm({trigger: this.options.alarm})
    }
  }

  private populateCalendarWithEvents() {
    this.apiData.data.forEach(event => {
      const currentEvent = this.addEvent(event);
      this.setEventAlarm(currentEvent);
    })
  }


  transform(): string {
    this.populateCalendarWithEvents();
    return this.calendar.toString()
  }


}


export type HourMinuteTuple = [hour: number, minute: number];

export type ApiDataTransformerICalDI = {
  getTranslation: typeof getTranslation,
  ICalCalendar: typeof ICalCalendar,
  ICalEventTransparency: typeof ICalEventTransparency,
  DateTime: typeof DateTime
};

export type ApiDataTransformerICalOptions = {
  startTime?: HourMinuteTuple; // e.g. [6, 30]
  endTime?: HourMinuteTuple; // e.g. [7, 15]
  allDay?: boolean;
  alarm?: number // e.g. 600 -> 10 min before
  offsetEvent?: number // e.g. 1 -> for offsetting event by one day
  customSummary?: string // e.g. 'Abholung Müll %1 (%2)' - where %1 is the type and %2 is the schedule,
  translated?: "de" | "en" | undefined
}