import { z } from "zod";

export const schemaQuery = z.object({
  streetname: z.string().max(150),
  streetno: z.string().max(50),
  format: z.enum(["json", "ical", "csv"]).default("json")
})