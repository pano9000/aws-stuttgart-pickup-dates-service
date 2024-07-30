import { describe, test, assert } from "vitest";
import getMIMEType from "./getMIMEType";

type TestCase = [input: undefined|string, output: string]
const testCases: TestCase[] = [
  ["json", "application/json"],
  ["csv", "text/csv"],
  ["ical", "text/calendar"],
  [undefined, "application/json"]
]

const createTestCase = (testCase: TestCase) => {
  return test(`should return MIME Type '${testCase[1]}' for '${testCase[0]}'`, () => {
    //@ts-expect-error -- due to undefined value above
    assert.strictEqual(getMIMEType(testCase[0]), testCase[1])
  })
}

describe("getContentType", () => {
  testCases.forEach(testCase => createTestCase(testCase))
})