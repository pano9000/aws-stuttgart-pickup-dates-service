import { envInitCheck, EnvInitError } from "./envInitCheck";
import { assert, assertType, describe, test } from "vitest"


test("should throw an error, when a required variable is not existing", () => {
  delete process.env.THIS_WILL_FAIL;
  assert.throws( () => envInitCheck(["THIS_WILL_FAIL"]));
})

test("should throw an error of EnvInitError, with the missing env name in its message", () => {
  delete process.env.THIS_WILL_FAIL;
  try {
    envInitCheck(["THIS_WILL_FAIL"])
  } catch(error) {
    if (error instanceof EnvInitError) {
      assert.match(error.message, /THIS_WILL_FAIL/, "The env name did not appear ins the message")
    }
    else {
      throw new Error("Did not receive an EnvInitError")
    }
  }
})

test("should throw an error, when a required variable is an empty string", () => {
  process.env.THIS_WILL_FAIL = "";
  assert.throws( () => envInitCheck(["THIS_WILL_FAIL"]));
})

test("should not throw an error, when a required variable is set", () => {
  process.env.THIS_WILL_PASS = "hello";
  assert.doesNotThrow( () => envInitCheck(["THIS_WILL_PASS"]));
})