import { z } from "zod";
import { SchemaAwsApiServiceEventTypeName } from "~/server/services/AwsApiService"
import { SchemaRetrieveDataFacadeFormat } from "~/server/services/RetrieveDataFacade"

export const schemaQuery = z.object({
  streetname: z.string().max(100),
  streetno: z.string().max(50),
  format: SchemaRetrieveDataFacadeFormat.catch("json"),
  type: z.string().optional()
    .transform(str => {
      return (!str)
        ? undefined
        : Array.from(new Set(str.split(",").map(splitVal => splitVal.trim())))
    })
    .pipe(z.array(SchemaAwsApiServiceEventTypeName).optional()).catch(undefined)
});

export type ApiQueryBase = z.infer<typeof schemaQuery>;