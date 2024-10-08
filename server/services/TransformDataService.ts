/* eslint-disable @typescript-eslint/no-extraneous-class */
import type { AwsApiServiceResponseAll, AwsApiServiceEventTypeName, AwsApiServiceEventScheduleName } from "./AwsApiService"
import ical, { ICalEventTransparency } from 'ical-generator';
import { DateTime } from "luxon";
import getTranslation from "~/server/utils/getTranslation"
//@TODO: error handling?
export class TransformDataService {

  static toCSV(originalData: AwsApiServiceResponseAll, options?: CSVOptions): string {

    //@TODO investigate if LF/CR could be come an issue?
    const csvHeader = getTranslation(options?.translated, "csv_header") || `date,type,schedule,irregularSchedule,streetname,streetno\r\n`;

    //@TODO investigate if we need to wrap values in double quotes -> not sure if streetname/number might cause issues, if not
    const csvLines = originalData.data.map((event) => {
      const translations = {
        eventType: getTranslation(options?.translated, `waste_${event.type}`) || event.type,
        eventSchedule: getTranslation(options?.translated, `schedule_${event.schedule}`) || event.schedule,
      }
      return [event.date, translations.eventType, translations.eventSchedule, event.irregularSchedule, originalData.information.streetname, originalData.information.streetno].join(",")
    })

    return csvHeader + csvLines.join("\r\n")
  }

  static toICal(originalData: AwsApiServiceResponseAll, options?: ICalOptions): string {

    const { streetname, streetno } = originalData.information;
    const calendar = ical({
      name: `Abfallwirtschaft Stuttgart Pickups ${streetname} ${streetno}`,
      timezone: "Europe/Berlin"
    })

    const createDate = (dateString: string, time: HourMinuteTuple) => {
      const date = DateTime.fromISO(dateString, {zone: "Europe/Berlin"}).set({hour: time[0], minute: time[1]});
      if (!date.isValid) throw new Error("Unable to create a valid date")

      if (options?.offsetEvent && options.offsetEvent > 0) {
        return date.minus({ days: options.offsetEvent})
      }

      return date
    }

    const createSummary = (eventType: AwsApiServiceEventTypeName, eventSchedule: AwsApiServiceEventScheduleName) => {
      const translations = {
        eventType: getTranslation(options?.translated, `waste_${eventType}`) || eventType,
        eventSchedule: getTranslation(options?.translated, `schedule_${eventSchedule}`) || eventSchedule,
        pickup: getTranslation(options?.translated, `term_pickup`) || "Pickup"
      }
      if (options?.customSummary) {
        //@TODO: strip any html? or vcalendar tags
        return options.customSummary.replaceAll("%1", translations.eventType).replaceAll("%2", translations.eventSchedule);
      }
      return `${translations.pickup} ${translations.eventType} (${translations.eventSchedule})${(options?.offsetEvent) ? getTranslation(options?.translated, `term_offset`) || "Offset" : ''}`
    }

    originalData.data.forEach(event => {

      const currentEvent = calendar.createEvent({
        start: createDate(event.date, options?.startTime || [6, 30]),
        end: createDate(event.date, options?.endTime || [7, 0]),
        summary: createSummary(event.type, event.schedule),
        //description: `AWS Pickup ${event.type} (${event.schedule}) ${(options?.offsetEvent) ? 'offset' : ''}`,
        location: `${streetname} ${streetno}`,
        transparency: ICalEventTransparency.TRANSPARENT,
        allDay: options?.allDay
      })

      if (options?.alarm && Number.isInteger(options.alarm)) {
        currentEvent.createAlarm({trigger: options.alarm})
      }


    })

    return calendar.toString()
  }

}


export type HourMinuteTuple = [hour: number, minute: number];
export type ICalOptions = TransformDataServiceOptionsBase & {
  startTime?: HourMinuteTuple; // e.g. [6, 30]
  endTime?: HourMinuteTuple; // e.g. [7, 15]
  allDay?: boolean;
  alarm?: number // e.g. 600 -> 10 min before
  offsetEvent?: number // e.g. 1 -> for offsetting event by one day
  customSummary?: string // e.g. 'Abholung Müll %1 (%2)' - where %1 is the type and %2 is the schedule,
}

export type TransformDataServiceOptionsBase = {
  translated?: "de" | "en" | undefined
}

export type CSVOptions = TransformDataServiceOptionsBase & {}