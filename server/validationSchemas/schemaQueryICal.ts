import { z } from "zod"
import { schemaQuery } from "./schemaQuery";
import type { HourMinuteTuple } from "~/server/services/TransformDataService"

const timeToHourMinuteTupleTransformer = (timeString: string | undefined, ctx: z.RefinementCtx ) => {
  if (!timeString) return undefined;
  const timeRegex = /^(?<hour>(0?[0-9])|(1[0-9])|(2[0-3])):(?<minute>(0[0-9])|[1-5][0-9])/
  const timeStringMatch = timeString?.match(timeRegex) // hh:mm format
  if (!timeStringMatch || !timeStringMatch.groups ) {
    ctx.addIssue({fatal: true, code: "invalid_string", validation: "regex", message: "Expected string in HH:MM format"})
    return z.NEVER;
  }
  const hourMinuteTuple: HourMinuteTuple = [parseInt(timeStringMatch.groups.hour), parseInt(timeStringMatch.groups.minute)]
  return hourMinuteTuple
}

export const schemaQueryICal = schemaQuery.extend({
  startTime: z.string().optional().transform(timeToHourMinuteTupleTransformer),
  endTime: z.string().optional().transform(timeToHourMinuteTupleTransformer),
  allDay: z.coerce.boolean().optional(),
  alarm: z.coerce.number().min(0).max(999_999).optional(),
  offsetEvent: z.coerce.number().min(0).max(999).optional(),
  customSummary: z.string().max(600).optional()
})

export type ApiQueryICal = z.infer<typeof schemaQueryICal>;