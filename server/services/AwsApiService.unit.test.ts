import { AwsApiService, SchemaAwsApiServiceResponseAll } from "./AwsApiService";
import { assert, describe, test, vi } from "vitest"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { awsPickupDataSuccess, awsPickupDataNonExisting, awsPickupDataWrongUrlParam } from "~/mocks/routes/awsAPIpickup"
import { AwsApiServiceError } from "./AwsApiServiceError";
import { HTTPError } from "got";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMockGot = (fakeDataToReturn: any) => {
  return vi.fn( () => {
    return {
      json() {
        return fakeDataToReturn
      }
    }
  })
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    //@ts-expect-error - due to mocked instance
    const awsApiService = new AwsApiService("https://test.com/api", getMockGot(awsPickupDataSuccess))

    const transformedData = await awsApiService.getAll("Test Str.", "2");
    const validatedData = SchemaAwsApiServiceResponseAll.safeParse(transformedData)
    assert.isTrue(validatedData.success)
  })

  test("should throw an AwsApiServiceError with reason 'validation' and errorData of ZodError, if the API returns data in an unexpected format", async () => {
    const fakeApiResponse = { unexpected: "format", fail: "this should" }
    //@ts-expect-error - due to mocked instance
    const awsApiService = new AwsApiService("https://test.com/api", getMockGot(fakeApiResponse))

    try {
      await awsApiService.getAll("Test Str.", "2");
    }
    catch(error) {
      assert.isDefined(error)
      assert.instanceOf(error, AwsApiServiceError)
      //@ts-expect-error - confirmed instanceOf AwsApiServiceError, but TS inference is not picking it up
      assert.equal(error.reason, "validation")
      //@ts-expect-error - confirmed instanceOf AwsApiServiceError, but TS inference is not picking it up
      assert.exists(error.errorData.issues);
    }
  })

  test("should throw an AwsApiServiceError with reason 'http', if the API fetch call fails due to some HTTP error", async () => {
    const response = {statusCode: 404, statusMessage: "Not Found"};
    //@ts-expect-error - due to mocked response
    const fakeHTTPError = new HTTPError(response);
    //@ts-expect-error - due to mocked instance
    const awsApiService = new AwsApiService("https://test.com/api", getMockGotThrowing(fakeHTTPError))

    try {
      await awsApiService.getAll("Test Str.", "2");
    }
    catch(error) {
      assert.isDefined(error)
      assert.instanceOf(error, AwsApiServiceError)
      //@ts-expect-error - confirmed instanceOf AwsApiServiceError, but TS inference is not picking it up
      assert.equal(error.reason, "http");
      //@ts-expect-error - confirmed instanceOf AwsApiServiceError, but TS inference is not picking it up
      assert.exists(error.errorData.code);
    }
  })

  test("should throw an AwsApiServiceError with reason 'generic', if there is an other generic error", async () => {
    const errMessage = "Some Strange Error happened";
    //@ts-expect-error - due to mocked instance
    const awsApiService = new AwsApiService("https://test.com/api", getMockGotThrowing(new Error(errMessage)))

    try {
      await awsApiService.getAll("Test Str.", "2");
    }
    catch(error) {
      assert.isDefined(error)
      assert.instanceOf(error, AwsApiServiceError)
      //@ts-expect-error - confirmed instanceOf AwsApiServiceError, but TS inference is not picking it up
      assert.equal(error.reason, "generic");
      //@ts-expect-error - confirmed instanceOf AwsApiServiceError, but TS inference is not picking it up
      assert.exists(error.errorData.message);
      //@ts-expect-error - confirmed instanceOf AwsApiServiceError, but TS inference is not picking it up
      assert.equal(error.errorData.message, errMessage);


    }
  })

  test("should throw an AwsApiServiceError with reason 'generic', if there is an error that is not an instanceof Error", async () => {
    //@ts-expect-error - due to mocked instance
    const awsApiService = new AwsApiService("https://test.com/api", getMockGotThrowing(2))

    try {
      await awsApiService.getAll("Test Str.", "2");
    }
    catch(error) {
      assert.isDefined(error)
      assert.instanceOf(error, AwsApiServiceError)
      //@ts-expect-error - confirmed instanceOf AwsApiServiceError, but TS inference is not picking it up
      assert.equal(error.reason, "generic")
    }
  })

})

describe("getRaw Method", async () => {
  test("should return the same, unaltered object as the AWS Stuttgart API", async () => {
    //@ts-expect-error - due to mocked instance
    const awsApiService = new AwsApiService("https://test.com/api", getMockGot(awsPickupDataSuccess))

    const rawData = await awsApiService.getRaw("Test Str.", "2");
    //@ts-expect-error - @TODO Fix typing here
    assert.deepEqual(rawData, awsPickupDataSuccess)
  })

  test("should throw an AwsApiServiceError with reason 'http', if the API fetch call fails due to some HTTP error", async () => {
    const response = {statusCode: 404, statusMessage: "Not Found"};
    //@ts-expect-error - due to mocked response
    const fakeHTTPError = new HTTPError(response);
    //@ts-expect-error - due to mocked instance
    const awsApiService = new AwsApiService("https://test.com/api", getMockGotThrowing(fakeHTTPError))

    try {
      await awsApiService.getRaw("Test Str.", "2");
    }
    catch(error) {
      assert.isDefined(error)
      assert.instanceOf(error, AwsApiServiceError)
      //@ts-expect-error - confirmed instanceOf AwsApiServiceError, but TS inference is not picking it up
      assert.equal(error.reason, "http")
    }
  })

})