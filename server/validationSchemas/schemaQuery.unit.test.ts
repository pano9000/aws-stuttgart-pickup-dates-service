import { assert, describe, it } from "vitest"
import { schemaQuery } from "./schemaQuery"

describe("schemaQuery Unit Tests", () => {

  it("should not be successful, when streetname is longer than 100 chars", () => {

    const fakeData = { streetname: "Test Str.Test Str.Test Str.Test Str.Test Str.Test Str.Test Str.Test Str.Test Str.Test Str.Test Str.Te", streetno: "123" }
    const result = schemaQuery.safeParse(fakeData)
    assert.isFalse(result.success);

  })

  it("should not be successful, when streetno is longer than 50", () => {

    const fakeData = { streetname: "Test Str.", streetno: "123 123 123 123 123 123 123 123 123 123 123 123 123" }
    const result = schemaQuery.safeParse(fakeData)
    assert.isFalse(result.success);

  })

  it("should revert to 'json' as default format, when 'format' query is left empty", () => {

    const fakeData = { streetname: "Test Str.", streetno: "123" }
    const result = schemaQuery.safeParse(fakeData)
    assert.isTrue(result.success);
    assert.equal(result.data?.format, "json")

  })

  it("should revert to 'json' as default format, when 'format' uses invalid value", () => {

    const fakeData = { streetname: "Test Str.", streetno: "123", format: "fake" }
    const result = schemaQuery.safeParse(fakeData)
    assert.isTrue(result.success);
    assert.equal(result.data?.format, "json")

  })

  it("should revert to 'undefined' as default type, when 'type' query is left empty", () => {

    const fakeData = { streetname: "Test Str.", streetno: "123" }
    const result = schemaQuery.safeParse(fakeData)
    assert.isTrue(result.success);
    assert.deepEqual(result.data?.type, undefined)

  })

  it("should revert to 'undefined' as default type, when 'type' query is an invalid value", () => {

    const fakeData = { streetname: "Test Str.", streetno: "123", type: "fake" }
    const result = schemaQuery.safeParse(fakeData);

    console.log()
    assert.isTrue(result.success);
    assert.deepEqual(result.data?.type, undefined)

  })

  it("should revert to 'undefined' as default type, when 'type' query consists of a valid and an invalid value", () => {

    const fakeData = { streetname: "Test Str.", streetno: "123", type: "fake,organic" }
    const result = schemaQuery.safeParse(fakeData);

    console.log()
    assert.isTrue(result.success);
    assert.deepEqual(result.data?.type, undefined)

  })


  it("should tranform 'type' to an array, when 'type' query is a valid value", () => {

    const fakeData = { streetname: "Test Str.", streetno: "123", type: "organic" }
    const result = schemaQuery.safeParse(fakeData)
    assert.isTrue(result.success);
    assert.deepEqual(result.data?.type, ["organic"])

  })

  it("should tranform 'type' to an array, when 'type' query contains two valid values separated by comma", () => {

    const fakeData = { streetname: "Test Str.", streetno: "123", type: "organic,residual" }
    const result = schemaQuery.safeParse(fakeData)
    assert.isTrue(result.success);
    assert.deepEqual(result.data?.type, ["organic", "residual"])

  })

  it("should tranform 'type' to an array, when 'type' query contains two valid values separated by comma + space", () => {

    const fakeData = { streetname: "Test Str.", streetno: "123", type: "organic, residual, paper" }
    const result = schemaQuery.safeParse(fakeData)
    assert.isTrue(result.success);
    assert.deepEqual(result.data?.type, ["organic", "residual", "paper"])

  })

  it("should tranform 'type' to an array and remove duplicate values, when 'type' query contains valid but duplicate values separated by comma", () => {

    const fakeData = { streetname: "Test Str.", streetno: "123", type: "organic,organic,paper" }
    const result = schemaQuery.safeParse(fakeData)
    assert.isTrue(result.success);
    assert.deepEqual(result.data?.type, ["organic", "paper"])

  })
})
