import { AwsApiService, SchemaAwsApiServiceResponseAll } from "./AwsApiService";
import { assert, describe, test, vi } from "vitest"
import { awsPickupDataSuccess, awsPickupDataNonExisting, awsPickupDataWrongUrlParam } from "~/mocks/routes/awsAPIpickup"
import { AwsApiServiceError } from "./AwsApiServiceError";
import { HTTPError } from "got";


const getMockGot = (fakeDataToReturn: any) => {
  return vi.fn( () => {
    return {
      json() {
        return fakeDataToReturn
      }
    }
  })
}



const getMockGotThrowing = (errorToThrow: any) => {
  return vi.fn( () => {
    throw errorToThrow
  })
}

test("should correctly return a default instance", () => {
    //process.env.AWSAPPENV_AWS_API_URL = "https://test.com/api"
    //constructor(apiUrl: string = process.env.AWSAPPENV_AWS_API_URL as string, gotClient: Got = defaultGot, logger: Console = console) {
    const awsApiServiceInstance = new AwsApiService("https://test.com/api")
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

  test("should throw an AwsApiServiceError with reason 'validation' and errorData of ZodError, if the API returns data in an unexpected format", async () => {
    const fakeApiResponse = { unexpected: "format", fail: "this should" }
    //@ts-expect-error
    const awsApiService = new AwsApiService("https://test.com/api", getMockGot(fakeApiResponse))

    try {
      const transformedData = await awsApiService.getAll("Test Str.", "2");
    }
    catch(error) {
      assert.isDefined(error)
      assert.instanceOf(error, AwsApiServiceError)
      //@ts-ignore
      assert.equal(error.reason, "validation")
      //@ts-ignore
      assert.exists(error.errorData.issues);
    }
  })

  test("should throw an AwsApiServiceError with reason 'http', if the API fetch call fails due to some HTTP error", async () => {
    const response = {statusCode: 404, statusMessage: "Not Found"};
    //@ts-expect-error
    const fakeHTTPError = new HTTPError(response);
    //@ts-expect-error
    const awsApiService = new AwsApiService("https://test.com/api", getMockGotThrowing(fakeHTTPError))

    try {
      const transformedData = await awsApiService.getAll("Test Str.", "2");
    }
    catch(error) {
      assert.isDefined(error)
      assert.instanceOf(error, AwsApiServiceError)
      //@ts-ignore
      assert.equal(error.reason, "http");
      //@ts-ignore
      assert.exists(error.errorData.code);
    }
  })

  test("should throw an AwsApiServiceError with reason 'generic', if there is an other generic error", async () => {
    const errMessage = "Some Strange Error happened";
    //@ts-expect-error
    const awsApiService = new AwsApiService("https://test.com/api", getMockGotThrowing(new Error(errMessage)))

    try {
      const transformedData = await awsApiService.getAll("Test Str.", "2");
    }
    catch(error) {
      assert.isDefined(error)
      assert.instanceOf(error, AwsApiServiceError)
      //@ts-ignore
      assert.equal(error.reason, "generic");
      //@ts-ignore
      assert.exists(error.errorData.message);
      //@ts-ignore
      assert.equal(error.errorData.message, errMessage);


    }
  })

  test("should throw an AwsApiServiceError with reason 'generic', if there is an error that is not an instanceof Error", async () => {
    //@ts-expect-error
    const awsApiService = new AwsApiService("https://test.com/api", getMockGotThrowing(2))

    try {
      const transformedData = await awsApiService.getAll("Test Str.", "2");
    }
    catch(error) {
      assert.isDefined(error)
      assert.instanceOf(error, AwsApiServiceError)
      //@ts-ignore
      assert.equal(error.reason, "generic")
    }
  })

})

describe("getRaw Method", async () => {
  test("should return the same, unaltered object as the AWS Stuttgart API", async () => {
    //@ts-expect-error
    const awsApiService = new AwsApiService("https://test.com/api", getMockGot(awsPickupDataSuccess))

    const rawData = await awsApiService.getRaw("Test Str.", "2");
    //@ts-ignore
    assert.deepEqual(rawData, awsPickupDataSuccess)
  })

  test("should throw an AwsApiServiceError with reason 'http', if the API fetch call fails due to some HTTP error", async () => {
    const response = {statusCode: 404, statusMessage: "Not Found"};
    //@ts-expect-error
    const fakeHTTPError = new HTTPError(response);
    //@ts-expect-error
    const awsApiService = new AwsApiService("https://test.com/api", getMockGotThrowing(fakeHTTPError))

    try {
      const transformedData = await awsApiService.getRaw("Test Str.", "2");
    }
    catch(error) {
      assert.isDefined(error)
      assert.instanceOf(error, AwsApiServiceError)
      //@ts-ignore
      assert.equal(error.reason, "http")
    }
  })

})