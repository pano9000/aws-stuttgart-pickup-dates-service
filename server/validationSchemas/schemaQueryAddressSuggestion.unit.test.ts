import { assert, describe, it } from "vitest"
import { schemaQueryAddressSuggestion } from "./schemaQueryAddressSuggestion"

describe("schemaQuery Unit Tests", () => {


  it("should not be successful, when streetname is longer than 100 chars", () => {

    const fakeData = { streetname: "Test Str.Test Str.Test Str.Test Str.Test Str.Test Str.Test Str.Test Str.Test Str.Test Str.Test Str.Te", streetno: "123" }
    const result = schemaQueryAddressSuggestion.safeParse(fakeData)
    assert.isFalse(result.success);

  })

  it("should not be successful, when streetno is longer than 50", () => {

    const fakeData = { streetname: "Test Str.", streetno: "123 123 123 123 123 123 123 123 123 123 123 123 123" }
    const result = schemaQueryAddressSuggestion.safeParse(fakeData)
    assert.isFalse(result.success);

  })

  it("should not be successful, when streetname is an empty string", () => {

    const fakeData = { streetname: "", streetno: "123" }
    const result = schemaQueryAddressSuggestion.safeParse(fakeData)
    assert.isFalse(result.success);

  })

  it("should not be successful, when streetname is not present", () => {

    const fakeData = { streetno: "123" }
    const result = schemaQueryAddressSuggestion.safeParse(fakeData)
    assert.isFalse(result.success);

  })

  it("should be successful, when streetname is present", () => {

    const fakeData = { streetname: "Test Str." }
    const result = schemaQueryAddressSuggestion.safeParse(fakeData)
    assert.isTrue(result.success);

  })

  it("should be successful, when streetname and streetno is present", () => {

    const fakeData = { streetname: "Test Str.", streetno: "123" }
    const result = schemaQueryAddressSuggestion.safeParse(fakeData)
    assert.isTrue(result.success);

  })

})