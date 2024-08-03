import { schemaQuery } from "~/server/validationSchemas/schemaQuery";
import { schemaQueryICal } from "~/server/validationSchemas/schemaQueryICal";

import type { ICalOptions } from "~/server/services/TransformDataService";
import type { QueryObject } from "ufo"
import type { ApiQueryBase } from "~/server/validationSchemas/schemaQuery"
import type { ApiQueryICal } from "~/server/validationSchemas/schemaQueryICal"

export default function getValidatedDataAndOptions(query: QueryObject): [validatedData: ApiQueryBase | ApiQueryICal, formatOpions: ICalOptions | undefined] {
  if (query.format === "ical") {
    const validatedData = schemaQueryICal.parse(query);
    const formatOptions: ICalOptions = {
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      allDay: validatedData.allDay,
      offsetEvent: validatedData.offsetEvent,
      alarm: validatedData.alarm,
      customSummary: validatedData.customSummary,
    }
    return [validatedData, formatOptions]
  }
  return [schemaQuery.parse(query), undefined]
}