import { default as AwsApiService, SchemaAwsApiServiceResponseAll } from "./AwsApiService";
import { assert, describe, test, vi } from "vitest"
import { awsPickupDataSuccess, awsPickupDataNonExisting, awsPickupDataWrongUrlParam } from "~/mocks/routes/awsAPIpickup"
import { z } from "zod"


const getMockGot = (fakeDataToReturn: any) => {
  return vi.fn( () => {
    return {
      json() {
        return fakeDataToReturn
      }
    }
  })
}

test("should correctly return a default instance", () => {
    //process.env.AWSAPPENV_AWS_API_URL = "https://test.com/api"
    //constructor(apiUrl: string = process.env.AWSAPPENV_AWS_API_URL as string, gotClient: Got = defaultGot, logger: Console = console) {
    const awsApiServiceInstance = new AwsApiService("https://test.com/api")
    console.log(Object.getPrototypeOf(awsApiServiceInstance), "yoooo")
    assert.instanceOf(awsApiServiceInstance, AwsApiService)
})

describe("getAll Method", async () => {
  test("should return a transformed object in the expected schema", async () => {
    //@ts-expect-error
    const awsApiService = new AwsApiService("https://test.com/api", getMockGot(awsPickupDataSuccess))

    const transformedData = await awsApiService.getAll("Test Str.", "2");
    const validatedData = SchemaAwsApiServiceResponseAll.safeParse(transformedData)
    assert.isTrue(validatedData.success)
  })

  test("should throw an AwsApiServiceError with cause 'validationFail', if the API returns data in an unexpected format", async () => {
    const fakeAPIResponse = { unexpected: "format", fail: "this should" }
    //@ts-expect-error
    const awsApiService = new AwsApiService("https://test.com/api", getMockGot(fakeAPIResponse))

    try {
      const transformedData = await awsApiService.getAll("Test Str.", "2");
    }
    catch(error) {
      assert.isDefined(error)
      assert.instanceOf(error, AwsApiServiceError)
      
    }

  })

})

describe("getRaw Method", async () => {
  test("should return the same object as the API", async () => {
    //@ts-expect-error
    const awsApiService = new AwsApiService("https://test.com/api", getMockGot(awsPickupDataSuccess))

    const rawData = await awsApiService.getRaw("Test Str.", "2");
    //@ts-ignore
    assert.deepEqual(rawData, awsPickupDataSuccess)
  })

})