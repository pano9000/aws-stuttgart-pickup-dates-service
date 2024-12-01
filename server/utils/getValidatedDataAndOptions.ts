import { schemaQuery } from "~/server/validationSchemas/schemaQuery";
import { schemaQueryICal } from "~/server/validationSchemas/schemaQueryICal";

import type { ApiDataTransformerICalOptions } from "~/server/services/ApiDataTransformer/ApiDataTransformerICal";
import type { QueryObject } from "ufo"
import type { ApiQueryBase } from "~/server/validationSchemas/schemaQuery"
import type { ApiQueryICal } from "~/server/validationSchemas/schemaQueryICal"

export default function getValidatedDataAndOptions(query: QueryObject): [validatedData: ApiQueryBase | ApiQueryICal, formatOpions: ApiDataTransformerICalOptions | undefined] {
  if (query.format === "ical") {
    const validatedData = schemaQueryICal.parse(query);
    const formatOptions: ApiDataTransformerICalOptions = {
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      allDay: validatedData.allDay,
      offsetEvent: validatedData.offsetEvent,
      alarm: validatedData.alarm,
      customSummary: validatedData.customSummary,
      translated: validatedData.translated
    }
    return [validatedData, formatOptions]
  }

  else if (query.format === "csv") {
    const validatedData = schemaQuery.parse(query); //@TODO replace with CSV, when CSV options are implemented
    const formatOptions: ApiDataTransformerICalOptions = {
      translated: validatedData.translated
    }
    return [validatedData, formatOptions]
  }

  return [schemaQuery.parse(query), undefined]
}