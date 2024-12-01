import type { AwsApiServiceResponseAll } from "../AwsApiService"
import type getTranslation from "~/server/utils/getTranslation"
import type { IApiDataTransformer } from "./IApiDataTransformer";


export class ApiDataTransformerCSV implements IApiDataTransformer {
  private di: ApiDataTransformerCSVDI;
  private apiData: AwsApiServiceResponseAll;
  private options?: ApiDataTransformerCSVOptions;

  constructor(di: ApiDataTransformerCSVDI, apiData: AwsApiServiceResponseAll, options?: ApiDataTransformerCSVOptions) {
    this.di = di;
    this.apiData = apiData;
    this.options = options
  }

  private getHeader() {
    //@TODO investigate if LF/CR could be come an issue?
    return this.di.getTranslation(this.options?.translated, "csv_header") || `date,type,schedule,irregularSchedule,streetname,streetno\r\n`;
  }

  private getLines() {
    //@TODO investigate if we need to wrap values in double quotes -> not sure if streetname/number might cause issues, if not
    return this.apiData.data.map((event) => {

      const eventType = this.di.getTranslation(this.options?.translated, `waste_${event.type}`) || event.type;
      const eventSchedule = this.di.getTranslation(this.options?.translated, `schedule_${event.schedule}`) || event.schedule;

      return [event.date, eventType, eventSchedule, event.irregularSchedule, this.apiData.information.streetname, this.apiData.information.streetno].join(",")
    })
  }

  transform() {
    return this.getHeader() + this.getLines().join("\r\n")
  }

}

export type ApiDataTransformerCSVDI = {
  getTranslation: typeof getTranslation
};


export type ApiDataTransformerCSVOptions = {
  translated?: "de" | "en" | undefined
}