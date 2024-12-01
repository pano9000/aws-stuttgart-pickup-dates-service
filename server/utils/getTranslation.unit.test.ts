import { describe, test, assert } from "vitest";
import getTranslation from "./getTranslation"

type TestCase = [input: [undefined|string, undefined|string], output: undefined|string]

const testCases: TestCase[] = [
  [[undefined, "anything"], undefined],
  [["de", "waste_paper"], "Altpapier"],
  [["en", "waste_paper"], "Waste Paper"],
  [["en", "no_valid_key"], undefined],
]

const createTestCase = (testCase: TestCase) => {
  return test(`should return '${testCase[1]?.toString()}' for arguments '${testCase[0]}'`, () => {
    //@ts-expect-error -- due to undefined value above
    assert.strictEqual(getTranslation(...testCase[0]), testCase[1])
  })
}

describe("getTranslation", () => {
  testCases.forEach(testCase => createTestCase(testCase))
})