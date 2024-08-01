import { assert, assertType, describe, test, vi } from "vitest"
import { TransformDataService } from "./TransformDataService";
import type { ICalOptions } from "./TransformDataService";

const fakeDataSuccess = JSON.parse('{"information":{"streetname":"Königstr.","streetno":"12"},"data":[{"date":"2024-07-15","unixDate":1721001600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-07-15","unixDate":1721001600,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-07-17","unixDate":1721174400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-07-22","unixDate":1721606400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-07-24","unixDate":1721779200,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-07-24","unixDate":1721779200,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-07-29","unixDate":1722211200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-07-29","unixDate":1722211200,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-07-30","unixDate":1722297600,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-07-31","unixDate":1722384000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-08-05","unixDate":1722816000,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-08-07","unixDate":1722988800,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-08-12","unixDate":1723420800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-08-12","unixDate":1723420800,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-08-14","unixDate":1723593600,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-08-14","unixDate":1723593600,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-08-19","unixDate":1724025600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-08-20","unixDate":1724112000,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-08-21","unixDate":1724198400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-08-26","unixDate":1724630400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-08-26","unixDate":1724630400,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-08-28","unixDate":1724803200,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-02","unixDate":1725235200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-09-04","unixDate":1725408000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-04","unixDate":1725408000,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-09-09","unixDate":1725840000,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-09-09","unixDate":1725840000,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-09-10","unixDate":1725926400,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-09-11","unixDate":1726012800,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-16","unixDate":1726444800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-09-18","unixDate":1726617600,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-23","unixDate":1727049600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-09-23","unixDate":1727049600,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-09-25","unixDate":1727222400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-25","unixDate":1727222400,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-09-30","unixDate":1727654400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-01","unixDate":1727740800,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-10-02","unixDate":1727827200,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-10-07","unixDate":1728259200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-07","unixDate":1728259200,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-10-09","unixDate":1728432000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-10-14","unixDate":1728864000,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-16","unixDate":1729036800,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-10-17","unixDate":1729123200,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2024-10-21","unixDate":1729468800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-21","unixDate":1729468800,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-10-22","unixDate":1729555200,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-10-23","unixDate":1729641600,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-10-28","unixDate":1730073600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-30","unixDate":1730246400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-11-05","unixDate":1730764800,"type":"residual","schedule":"W1","irregularSchedule":true},{"date":"2024-11-05","unixDate":1730764800,"type":"residual","schedule":"W2","irregularSchedule":true},{"date":"2024-11-06","unixDate":1730851200,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-11-07","unixDate":1730937600,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2024-11-11","unixDate":1731283200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-11-12","unixDate":1731369600,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-11-13","unixDate":1731456000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-11-18","unixDate":1731888000,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-11-18","unixDate":1731888000,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-11-20","unixDate":1732060800,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-11-25","unixDate":1732492800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-11-27","unixDate":1732665600,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-11-27","unixDate":1732665600,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-12-02","unixDate":1733097600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-12-02","unixDate":1733097600,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-12-03","unixDate":1733184000,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-12-04","unixDate":1733270400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-12-09","unixDate":1733702400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-12-11","unixDate":1733875200,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-12-16","unixDate":1734307200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-12-16","unixDate":1734307200,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-12-18","unixDate":1734480000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-12-18","unixDate":1734480000,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-12-21","unixDate":1734739200,"type":"residual","schedule":"W1","irregularSchedule":true},{"date":"2024-12-23","unixDate":1734912000,"type":"paper","schedule":"W3","irregularSchedule":true},{"date":"2024-12-24","unixDate":1734998400,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2024-12-30","unixDate":1735516800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-12-30","unixDate":1735516800,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2025-01-02","unixDate":1735776000,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2025-01-07","unixDate":1736208000,"type":"residual","schedule":"W1","irregularSchedule":true},{"date":"2025-01-09","unixDate":1736380800,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2025-01-13","unixDate":1736726400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2025-01-13","unixDate":1736726400,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2025-01-14","unixDate":1736812800,"type":"paper","schedule":"W3","irregularSchedule":false}]}');
const fakeInvalidDate = JSON.parse('{"information":{"streetname":"Königstr.","streetno":"12"},"data":[{"date":"Invalid Date","unixDate":1721001600,"type":"residual","schedule":"W1","irregularSchedule":false}]}');

describe("TransformDataService", () => {

  describe("toCSV", () => {

    test("should return CSV like string with appropriate headers, correct length and correct format", () => {

      const result = TransformDataService.toCSV(fakeDataSuccess);
      assert.isString(result);
      assert.isTrue(result.startsWith(`data,type,schedule,irregularSchedule,streetname,streetno\r\n`))
      assert.strictEqual(result.split("\r\n")[1], "2024-07-15,residual,W1,false,Königstr.,12")
      assert.lengthOf(result.split("\r\n"), 85); //84 events + 1 header
    })

  })

  describe("toICal", () => {

    test("should return an iCal like string with default options", () => {
      const result = TransformDataService.toICal(fakeDataSuccess);
      assert.isTrue(result.startsWith(`BEGIN:VCALENDAR\r\n`))
      assert.lengthOf(result.split("BEGIN:VEVENT"), 85) //84 events + 1 header
    })

    test("should throw an error if provided Date String is invalid", () => {
      assert.throws( () => TransformDataService.toICal(fakeInvalidDate))
    })

    test("should correctly use custom summary with placeholders", () => {
      const testRegex = /SUMMARY:Abholung Custom Text\\, Type: .+ \/ Schedule: .+/gi
      const result = TransformDataService.toICal(fakeDataSuccess, {customSummary: "Abholung Custom Text, Type: %1 / Schedule: %2"});
      assert.match(result, testRegex)
    })


    test("should correctly offset start end and end date by supplied number", () => {
      const result = TransformDataService.toICal(fakeDataSuccess, {offsetEvent: 1});

      const firstStartMatch = result.match(/DTSTART:(?<date>.+)/);
      if (!firstStartMatch || !firstStartMatch.groups) throw new Error("No start date found!")
      const firstStartDate = firstStartMatch.groups.date.slice(0,8);
      assert.equal(firstStartDate, "20240714")
    })

    test("should correctly set custom start end and end date if supplied", () => {
      const result = TransformDataService.toICal(fakeDataSuccess, {startTime: [8, 30], endTime: [9, 30] });
      console.log(result)
      const firstStartMatch = result.match(/DTSTART:(?<date>.+)/);
      const firstEndMatch = result.match(/DTEND:(?<date>.+)/);

      if (!firstStartMatch || !firstStartMatch.groups) throw new Error("No start date found!")
      if (!firstEndMatch || !firstEndMatch.groups) throw new Error("No end date found!")

      const firstStartDate = firstStartMatch.groups.date;
      const firstEndDate = firstEndMatch.groups.date;
      console.log(firstStartDate, firstEndDate)

      assert.equal(firstStartDate, "20240715T083000")
      assert.equal(firstEndDate, "20240715T093000")


    })

    test("should correctly offset start end and end date by supplied number AND set custom start/end time", () => {
      const result = TransformDataService.toICal(fakeDataSuccess, {startTime: [10, 30], endTime: [12, 0], offsetEvent: 2});

      const firstStartMatch = result.match(/DTSTART:(?<date>.+)/);
      const firstEndMatch = result.match(/DTEND:(?<date>.+)/);

      if (!firstStartMatch || !firstStartMatch.groups) throw new Error("No start date found!")
      if (!firstEndMatch || !firstEndMatch.groups) throw new Error("No end date found!")

      const firstStartDate = firstStartMatch.groups.date;
      const firstEndDate = firstEndMatch.groups.date;

      assert.equal(firstStartDate, "20240713T103000")
      assert.equal(firstEndDate, "20240713T120000")

    })

    test("should correctly set allDay property to events if supplied", () => {
      const result = TransformDataService.toICal(fakeDataSuccess, {allDay: true });
      assert.match(result, /X-MICROSOFT-CDO-ALLDAYEVENT:TRUE/)
    })

    test("should correctly set alarm property to events if supplied", () => {
      const result = TransformDataService.toICal(fakeDataSuccess, {alarm: 24*60*60 }); // set alarm to 1D before (in seconds)
      const firstAlertMatch = result.match(/TRIGGER:(?<alarm>.+)/);
      if (!firstAlertMatch || !firstAlertMatch.groups) throw new Error("No alarm (TRIGGER) property found!")
      const firstAlert = firstAlertMatch.groups.alarm;
      assert.equal(firstAlert, "-P1D");
    })


  })

})