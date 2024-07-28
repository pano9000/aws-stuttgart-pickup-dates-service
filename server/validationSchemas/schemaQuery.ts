import { z } from "zod";
import { SchemaAwsApiServiceEventTypeName } from "~/server/services/AwsApiService"

export const schemaQuery = z.object({
  streetname: z.string().max(100),
  streetno: z.string().max(50),
  format: z.enum(["json", "ical", "csv"]).catch("json"),
  type: z.string().optional()
    .transform(str => {
      return (!str)
        ? undefined
        : Array.from(new Set(str.split(",").map(splitVal => splitVal.trim())))
    })
    .pipe(z.array(SchemaAwsApiServiceEventTypeName).optional()).catch(undefined)
});