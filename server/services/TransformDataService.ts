import type { AwsApiServiceResponseAll } from "./AwsApiService"

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
    throw new Error("TODO: implement");
  }

}
