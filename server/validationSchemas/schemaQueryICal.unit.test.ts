import { assert, describe, it, test, vi } from "vitest"
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

})
