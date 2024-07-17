import { z, ZodError } from "zod";

/** Handle server errors */
export default function(error: unknown) {

  console.error(error)
  if (error instanceof z.ZodError) {
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