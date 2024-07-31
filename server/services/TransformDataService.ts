import type { AwsApiServiceResponseAll } from "./AwsApiService"
import ical from 'ical-generator';
import { DateTime } from "luxon";

//@TODO: error handling?
export class TransformDataService {

  static toCSV(originalData: AwsApiServiceResponseAll): string {
    //@TODO investigate if LF/CR could be come an issue?
    const csvHeader = `data,type,schedule,irregularSchedule,streetname,streetno\r\n`;
    //@TODO investigate if we need to wrap values in double quotes -> not sure if streetname/number might cause issues, if not
    const csvLines = originalData.data.map((event) => {
      return [event.date, event.type, event.schedule, event.irregularSchedule, originalData.information.streetname, originalData.information.streetno].join(",")
    })

    return csvHeader + csvLines.join("\r\n")
  }

  static toICal(originalData: AwsApiServiceResponseAll): string {

    const { streetname, streetno } = originalData.information;
    const calendar = ical({
      name: `Abfallwirtschaft Stuttgart Pickups ${streetname} ${streetno}`,
      timezone: "Europe/Berlin"
    })

    const createDate = (dateString: string, hour: number, minute: number) => {
      const date = DateTime.fromISO(dateString, {zone: "Europe/Berlin"}).set({hour, minute});
      if (!date.isValid) {
        throw new Error("Unable to create a valid date")
      }
      return date
    }

    originalData.data.forEach(event => {

      calendar.createEvent({
        start: createDate(event.date, 6, 30),
        end: createDate(event.date, 7, 0),
        summary: `AWS Pickup ${event.type} (${event.schedule})`,
        location: `${streetname} ${streetno}`,
      })
    })

    return calendar.toString()
  }

}
