import { afterEach, assert, beforeAll, describe, test, vi } from "vitest"
import getValidatedQueryAndOptions from "~/server/utils/getValidatedDataAndOptions"
import * as defaultSchemaQueryICal from "~/server/validationSchemas/schemaQueryICal";
import { schemaQuery } from "~/server/validationSchemas/schemaQuery";
import { z } from "zod"
/*
//TODO mocking schemaQueryICal seems to fail, because I use .extend() on schemaQueryICal...


*/

vi.mock("~/server/validationSchemas/schemaQuery")
vi.mock("~/server/validationSchemas/schemaQueryICal")

describe("getValidatedDataAndOptions Unit Test", async () => {
  beforeAll( () => {
    // for schemaQueryICal need to mock the schemaQueryICal AND the parse method,
    // because it kinda gets overwritten by the mocm of 'schemaQuery', because
    // schemaQueryICal itself import 'schemaQuery' to .extend() it
    //@ts-expect-error - see comment above
    defaultSchemaQueryICal.schemaQueryICal = vi.fn().mockReturnValue(z.object())
    defaultSchemaQueryICal.schemaQueryICal.parse = vi.fn().mockReturnValue({
      startTime: [6,0],
      endTime: [6,3],
      allDay: undefined,
      alarm: undefined,
      offsetEvent: undefined,
      customSummary: "test"
    });

    schemaQuery.parse = vi.fn().mockReturnValue("whatever");
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  test("when format is json, should call schemaQuery and return undefined formatOptions", async () => {

    const result = getValidatedQueryAndOptions({streetname: "abc", streetno: "123", format: "json"})
    assert.isArray(result);
    assert.isUndefined(result[1]);
    //@ts-expect-error - Property 'mock' does not exist on type
    assert.lengthOf(schemaQuery.parse.mock.calls, 1);
    //@ts-expect-error - Property 'mock' does not exist on type
    assert.lengthOf(defaultSchemaQueryICal.schemaQueryICal.parse.mock.calls, 0);
  })

  test("when format is undefined, should call schemaQuery and return undefined formatOptions", async () => {
    const result = getValidatedQueryAndOptions({streetname: "abc", streetno: "123"})
    assert.isArray(result);
    assert.isUndefined(result[1]);
    //@ts-expect-error - Property 'mock' does not exist on type
    assert.lengthOf(schemaQuery.parse.mock.calls, 1)
    //@ts-expect-error - Property 'mock' does not exist on type
    assert.lengthOf(defaultSchemaQueryICal.schemaQueryICal.parse.mock.calls, 0)
  })

  test("when format is csv, should call schemaQuery and return formatOptions only with translated prop", async () => {
    const result = getValidatedQueryAndOptions({streetname: "abc", streetno: "123", format: "csv"})
    assert.isArray(result);
    assert.property(result[1], "translated");
    //@ts-expect-error - Property 'mock' does not exist on type
    assert.lengthOf(schemaQuery.parse.mock.calls, 1)
    //@ts-expect-error - Property 'mock' does not exist on type
    assert.lengthOf(defaultSchemaQueryICal.schemaQueryICal.parse.mock.calls, 0)
  })

  test("when format is ical, should call schemaQueryIcal and return defined formatOptions", async () => {
    const result = getValidatedQueryAndOptions({streetname: "abc", streetno: "123", format: "ical", customSummary: "test"})
    assert.isArray(result);
    assert.equal(result[1]?.customSummary, "test");
    //@ts-expect-error - Property 'mock' does not exist on type
    assert.lengthOf(schemaQuery.parse.mock.calls, 0);
    //@ts-expect-error - Property 'mock' does not exist on type
    assert.lengthOf(defaultSchemaQueryICal.schemaQueryICal.parse.mock.calls, 1)
  })
/*


  it("should call schemaQuery when format is json and have undefined formatOptions set", () => {
    getValidatedQueryAndOptions()
  })

  it("should call schemaQuery when format is csv and have undefined formatOptions set (currently)", () => {
    getValidatedQueryAndOptions()
  })
    */
})