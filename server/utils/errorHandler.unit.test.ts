import errorHandler from "./errorHandler";
import { assert, describe, test } from "vitest"
import { H3Error } from "h3"
import { date, ZodError } from "zod";

test("should throw an H3Error with 500 status code, when a generic Error happens", () => {

  try {
    errorHandler(new Error("hello!"));
  }
  catch(error) {
    if (error instanceof H3Error) {
      assert.equal(error.statusCode, 500) 
    } else {
      throw new Error("Did not receive a H3Error")
    }
  }

})

test("should throw an H3Error with 400 status code, and an extra data property when a ZodError happens", () => {
  try {
    const zodError = new ZodError([{code: "invalid_type", expected: "string", received: "undefined", message: "mock ZodIssue", path: ['addresses', 0, 'line1']}]);
    errorHandler(zodError);
  }
  catch(error) {
    if (error instanceof H3Error) {
      assert.equal(error.statusCode, 400);
      assert.exists(error.data)
      assert.equal(error.data[0].code, "invalid_type")
    } else {
      throw new Error("Did not receive a H3Error")
    }
  }

})
