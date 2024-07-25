import { assert, describe, test, vi } from "vitest"
import { RedisService, redisService } from "./RedisService"

const fakeDataSuccess = '{"information":{"streetname":"Königstr.","streetno":"12"},"data":[{"date":"2024-07-15","unixDate":1721001600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-07-15","unixDate":1721001600,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-07-17","unixDate":1721174400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-07-22","unixDate":1721606400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-07-24","unixDate":1721779200,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-07-24","unixDate":1721779200,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-07-29","unixDate":1722211200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-07-29","unixDate":1722211200,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-07-30","unixDate":1722297600,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-07-31","unixDate":1722384000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-08-05","unixDate":1722816000,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-08-07","unixDate":1722988800,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-08-12","unixDate":1723420800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-08-12","unixDate":1723420800,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-08-14","unixDate":1723593600,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-08-14","unixDate":1723593600,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-08-19","unixDate":1724025600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-08-20","unixDate":1724112000,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-08-21","unixDate":1724198400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-08-26","unixDate":1724630400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-08-26","unixDate":1724630400,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-08-28","unixDate":1724803200,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-02","unixDate":1725235200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-09-04","unixDate":1725408000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-04","unixDate":1725408000,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-09-09","unixDate":1725840000,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-09-09","unixDate":1725840000,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-09-10","unixDate":1725926400,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-09-11","unixDate":1726012800,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-16","unixDate":1726444800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-09-18","unixDate":1726617600,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-23","unixDate":1727049600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-09-23","unixDate":1727049600,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-09-25","unixDate":1727222400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-25","unixDate":1727222400,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-09-30","unixDate":1727654400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-01","unixDate":1727740800,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-10-02","unixDate":1727827200,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-10-07","unixDate":1728259200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-07","unixDate":1728259200,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-10-09","unixDate":1728432000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-10-14","unixDate":1728864000,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-16","unixDate":1729036800,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-10-17","unixDate":1729123200,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2024-10-21","unixDate":1729468800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-21","unixDate":1729468800,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-10-22","unixDate":1729555200,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-10-23","unixDate":1729641600,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-10-28","unixDate":1730073600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-30","unixDate":1730246400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-11-05","unixDate":1730764800,"type":"residual","schedule":"W1","irregularSchedule":true},{"date":"2024-11-05","unixDate":1730764800,"type":"residual","schedule":"W2","irregularSchedule":true},{"date":"2024-11-06","unixDate":1730851200,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-11-07","unixDate":1730937600,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2024-11-11","unixDate":1731283200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-11-12","unixDate":1731369600,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-11-13","unixDate":1731456000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-11-18","unixDate":1731888000,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-11-18","unixDate":1731888000,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-11-20","unixDate":1732060800,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-11-25","unixDate":1732492800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-11-27","unixDate":1732665600,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-11-27","unixDate":1732665600,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-12-02","unixDate":1733097600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-12-02","unixDate":1733097600,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-12-03","unixDate":1733184000,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-12-04","unixDate":1733270400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-12-09","unixDate":1733702400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-12-11","unixDate":1733875200,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-12-16","unixDate":1734307200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-12-16","unixDate":1734307200,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-12-18","unixDate":1734480000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-12-18","unixDate":1734480000,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-12-21","unixDate":1734739200,"type":"residual","schedule":"W1","irregularSchedule":true},{"date":"2024-12-23","unixDate":1734912000,"type":"paper","schedule":"W3","irregularSchedule":true},{"date":"2024-12-24","unixDate":1734998400,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2024-12-30","unixDate":1735516800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-12-30","unixDate":1735516800,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2025-01-02","unixDate":1735776000,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2025-01-07","unixDate":1736208000,"type":"residual","schedule":"W1","irregularSchedule":true},{"date":"2025-01-09","unixDate":1736380800,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2025-01-13","unixDate":1736726400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2025-01-13","unixDate":1736726400,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2025-01-14","unixDate":1736812800,"type":"paper","schedule":"W3","irregularSchedule":false}]}'

/*
const createMockIoredis = function (fakeDataToReturn: string) {
  return vi.fn( () => {
    return {
      async call() {
        return fakeDataToReturn
      }
    }
  })
}
*/


describe("RedisService Unit Tests", async () => {

  test("default export should correctly return a default instance", () => {
    assert.instanceOf(redisService, RedisService);
  })

  describe("jsonGET", async () => {
    test("w/ an existing address and w/o filters, should return an object, with the expected schema", async () => {
      //const mockIoredis = createMockIoredis(fakeDataSuccess);

      const mockCallMethod = vi.fn().mockResolvedValueOnce(fakeDataSuccess);

      const mockIoredis = vi.fn( () => {
        const mockCall = vi.fn();
        mockCall.call = mockCallMethod
        return mockCall
      })

      //@ts-expect-error - due to using mockIoredis
      const redisServiceInstance = new RedisService({host: "host", password: "password", port: 9999}, mockIoredis)
      const redisData = await redisServiceInstance.jsonGET("streetnr.|10");
      assert.isObject(redisData);
      assert.hasAllKeys(redisData, ["information", "data"])
      assert.lengthOf(mockCallMethod.mock.calls, 1);
      assert.deepEqual(mockCallMethod.mock.calls[0], ["JSON.GET", "streetnr.|10"]);

    })

    test("w/ date filters should call redis.call twice and return a filtered object, with the expected schema", async () => {

      const mockCallMethod = vi.fn()
        .mockResolvedValueOnce("{\"streetname\":\"Königstr.\",\"streetno\":\"12\"}")
        .mockResolvedValueOnce('[{"date":"2024-12-18","unixDate":1734480000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-12-18","unixDate":1734480000,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-12-21","unixDate":1734739200,"type":"residual","schedule":"W1","irregularSchedule":true},{"date":"2024-12-23","unixDate":1734912000,"type":"paper","schedule":"W3","irregularSchedule":true},{"date":"2024-12-24","unixDate":1734998400,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2024-12-30","unixDate":1735516800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-12-30","unixDate":1735516800,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2025-01-02","unixDate":1735776000,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2025-01-07","unixDate":1736208000,"type":"residual","schedule":"W1","irregularSchedule":true},{"date":"2025-01-09","unixDate":1736380800,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2025-01-13","unixDate":1736726400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2025-01-13","unixDate":1736726400,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2025-01-14","unixDate":1736812800,"type":"paper","schedule":"W3","irregularSchedule":false}]');

      const mockIoredis = vi.fn( () => {
        const mockCall = vi.fn();
        mockCall.call = mockCallMethod
        return mockCall
      })

      //@ts-expect-error
      const redisServiceInstance = new RedisService({host: "host", password: "password", port: 9999}, mockIoredis);
      const testDate = "2024-12-18";
      const testKey = "address_teststr.|1";
      const redisData = await redisServiceInstance.jsonGET(testKey, `$.data[?(@.date >= '${testDate}')]`);

      // should call the method twice
      assert.lengthOf(mockCallMethod.mock.calls, 2);
      assert.deepEqual(mockCallMethod.mock.calls[0], ["JSON.GET", testKey, "information"]);
      assert.deepEqual(mockCallMethod.mock.calls[1], ["JSON.GET", testKey, `$.data[?(@.date >= '${testDate}')]`]);
      // should return data still with correct keys
      assert.hasAllKeys(redisData, ["information", "data"])
      assert.lengthOf(redisData.data, 13)
    })

    test("w/ non-existing address and w/o filters should return null", async () => {
      const mockCallMethod = vi.fn().mockResolvedValue(null)

      const mockIoredis = vi.fn( () => {
        const mockCall = vi.fn();
        mockCall.call = mockCallMethod
        return mockCall
      });

      const testKey = "address_teststr.|1";
      //@ts-expect-error
      const redisServiceInstance = new RedisService({host: "host", password: "password", port: 9999}, mockIoredis)
      const redisData = await redisServiceInstance.jsonGET(testKey);

      assert.lengthOf(mockCallMethod.mock.calls, 1);
      assert.deepEqual(mockCallMethod.mock.calls[0], ["JSON.GET", testKey]);
      assert.isNull(redisData);
    })

    test("w/ non-existing address and w/ filters should return null", async () => {
      const mockCallMethod = vi.fn().mockResolvedValue(null)

      const mockIoredis = vi.fn( () => {
        const mockCall = vi.fn();
        mockCall.call = mockCallMethod
        return mockCall
      });

      const testDate = "2024-12-18";
      const testKey = "address_teststr.|1";

      //@ts-expect-error
      const redisServiceInstance = new RedisService({host: "host", password: "password", port: 9999}, mockIoredis)
      const redisData = await redisServiceInstance.jsonGET(testKey, `$.data[?(@.date >= '${testDate}')]`);

      assert.lengthOf(mockCallMethod.mock.calls, 1);
      assert.deepEqual(mockCallMethod.mock.calls[0], ["JSON.GET", testKey, "information"]);
      assert.isNull(redisData);
    })
  })

  describe("jsonSET", async () => {
    test.todo("")
    //@TODO
  })


})