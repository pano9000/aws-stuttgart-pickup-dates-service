import { assert, describe, test } from "vitest"
import getFilename from "./getFilename"

type GetFilenameTestCase = [arguments: Parameters<typeof getFilename>, expected: string]
const testCases: GetFilenameTestCase[] = [
  [["Königstr.", "12", "csv"], "Königstr 12.csv"],
  [["Königstr.", "12", "json"], "Königstr 12.json"],
  [["Fakestreet//\\Wextra Characters?", "12", "json"], "FakestreetWextra Characters 12.json"],
  [["Königstr.", "12|D", "ical"], "Königstr 12D.ical"]
]


describe("getFilename Unit tests", () => {
  testCases.forEach(testCase => {
    test(`with ${JSON.stringify(testCase[0])} should return '${testCase[1]}'`, () => {
      const actual = getFilename(...testCase[0]);
      assert.strictEqual(actual, testCase[1]);
    })
  })
})