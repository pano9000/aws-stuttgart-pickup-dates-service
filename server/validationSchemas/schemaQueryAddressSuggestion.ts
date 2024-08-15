import { z } from "zod";

export const schemaQueryAddressSuggestion = z.object({
  streetname: z.string().max(100),
  streetno: z.string().max(50).optional()
});