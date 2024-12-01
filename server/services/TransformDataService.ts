/* eslint-disable @typescript-eslint/no-extraneous-class */
import type { AwsApiServiceResponseAll } from "./AwsApiService"
import { ICalCalendar, ICalEventTransparency } from 'ical-generator';
import { DateTime } from "luxon";
import getTranslation from "~/server/utils/getTranslation.js"
import { ApiDataTransformerCSV } from "~/server/services/ApiDataTransformer/ApiDataTransformerCSV.js"
import { ApiDataTransformerICal } from "~/server/services/ApiDataTransformer/ApiDataTransformerICal.js";
import type { ApiDataTransformerCSVOptions } from "~/server/services/ApiDataTransformer/ApiDataTransformerCSV.js";
import type { ApiDataTransformerICalOptions } from "~/server/services/ApiDataTransformer/ApiDataTransformerICal.js";

//@TODO: error handling?
export class TransformDataService {

  static toCSV(apiData: AwsApiServiceResponseAll, options?: ApiDataTransformerCSVOptions): string {
    const transformer = new ApiDataTransformerCSV({ getTranslation: getTranslation }, apiData, options);
    return transformer.transform();
  }

  static toICal(apiData: AwsApiServiceResponseAll, options?: ApiDataTransformerICalOptions): string {
    const transformer = new ApiDataTransformerICal(
      {
        getTranslation: getTranslation,
        ICalCalendar: ICalCalendar,
        ICalEventTransparency: ICalEventTransparency,
        DateTime: DateTime,
      },
      apiData,
      options
    );
    return transformer.transform();
  }

}