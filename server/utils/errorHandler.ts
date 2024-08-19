import { ZodError } from "zod";
import { LoggerMeta } from "./winstonLogger";

/** Handle server errors */
export default function(error: unknown, operationId: string = "") {
  const loggerMeta = new LoggerMeta("server.utils.errorHandler", operationId);
  generalLogger.error(`Unhandled Error`, loggerMeta.withData({error}));

  if (error instanceof ZodError) {
    throw createError({
      status: 400,
      message: "Invalid Input",
      statusMessage: "Bad Request",
      data: error.issues,
      stack: "",
    });
  } else {
    throw createError({
      status: 500,
      message: "Unexpected Server Error",
      statusMessage: "Unexpected Server Error",
      data: {},
      stack: "",
    });
  }
}