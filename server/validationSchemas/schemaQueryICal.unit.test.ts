import { assert, describe, it } from "vitest"
import { schemaQueryICal } from "./schemaQueryICal"


describe("schemaQueryICal Unit Tests", () => {

  it("should not be successful, when invalid start/endtime is supplied", () => {
    const fakeData = { streetname: "Test Str.", streetno: "123", format: "ical", startTime: "25:45", endTime: "12:30" }
    const result = schemaQueryICal.safeParse(fakeData)
    assert.isFalse(result.success);

  })

  it("should transform start/endtime into HourMinuteTuple", () => {
    const fakeData = { streetname: "Test Str.", streetno: "123", format: "ical", startTime: "6:00", endTime: "12:30" }
    const expectedStartTime = [6,0]
    const expectedEndTime = [12,30]

    const result = schemaQueryICal.safeParse(fakeData)
    assert.isTrue(result.success);
    assert.deepEqual(result.data?.startTime, expectedStartTime)
    assert.deepEqual(result.data?.endTime, expectedEndTime)
  })

  it("should transform start/endtime into undefined, when nothing is supplied", () => {
    const fakeData = { streetname: "Test Str.", streetno: "123", format: "ical", startTime: undefined, endTime: undefined }
    const result = schemaQueryICal.safeParse(fakeData)
    assert.isTrue(result.success);
    assert.isUndefined(result.data?.startTime);
    assert.isUndefined(result.data?.endTime);
  })

  it("should fail, if custom summary contains a CRLF sequence", () => {
    const fakeData = { streetname: "Test Str.", streetno: "123", format: "ical", startTime: "6:00", endTime: "12:30", customSummary: "Abc Def\r\nGhij" }
    const result = schemaQueryICal.safeParse(fakeData)
    assert.isFalse(result.success);
  })

  it("should fail, if custom summary contains a CR sequence", () => {
    const fakeData = { streetname: "Test Str.", streetno: "123", format: "ical", startTime: "6:00", endTime: "12:30", customSummary: "Abc Def\rGhij" }
    const result = schemaQueryICal.safeParse(fakeData)
    assert.isFalse(result.success);
  })

  it("should fail, if custom summary contains a LF sequence", () => {
    const fakeData = { streetname: "Test Str.", streetno: "123", format: "ical", startTime: "6:00", endTime: "12:30", customSummary: "Abc Def\nGhij" }
    const result = schemaQueryICal.safeParse(fakeData)
    assert.isFalse(result.success);
  })

  it("should pass, if custom summary contains valid text < 100 chars", () => {
    const fakeData = { streetname: "Test Str.", streetno: "123", format: "ical", startTime: "6:00", endTime: "12:30", customSummary: "Abc Def Ghij %1 (%2)" }
    const result = schemaQueryICal.safeParse(fakeData)
    assert.isTrue(result.success);
  })

})
