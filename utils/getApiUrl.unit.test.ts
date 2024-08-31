import { assert, describe, it } from "vitest"
import getApiUrl, { type GetApiUrlOptions } from "./getApiUrl.ts"

const createFakeOptions = (options?: Partial<GetApiUrlOptions>): GetApiUrlOptions  => {
  return {
    endpointName: options?.endpointName || "/api/v1/all",
    streetname: options?.streetname || "Teststr.",
    streetno: options?.streetno || "12",
    eventTypes: options?.eventTypes || ["recycle", "paper"],
    format: options?.format || "csv",
    language: options?.language || "de"
  }
};

type TestCaseGetApiUrl = [
  testTitle: string,
  argument: GetApiUrlOptions,
  expected: string,
]

const testCases: TestCaseGetApiUrl[] = [
  [
    `should return an URL string w/ options ${JSON.stringify(createFakeOptions())}`, 
    createFakeOptions(),
    "http://localhost:3000/api/v1/all?streetname=Teststr.&streetno=12&type=recycle%2Cpaper&format=csv&translated=de"
  ],
  [
    `should return an URL string w/ options ${JSON.stringify(createFakeOptions({format: "ical"}))}`, 
    createFakeOptions({format: "ical"}), 
    "http://localhost:3000/api/v1/all?streetname=Teststr.&streetno=12&type=recycle%2Cpaper&format=ical&translated=de"
  ],
  [
    `should return an URL string w/ options ${JSON.stringify(createFakeOptions({language: "en"}))}`, 
    createFakeOptions({language: "en"}), 
    "http://localhost:3000/api/v1/all?streetname=Teststr.&streetno=12&type=recycle%2Cpaper&format=csv&translated=en"
  ]
]

describe("getApiUrl", () => {

  testCases.forEach(testCase => {
    it(testCase[0], () => {
      const apiResult = getApiUrl(testCase[1]);
      assert.equal(apiResult, testCase[2])
    })
  })

})