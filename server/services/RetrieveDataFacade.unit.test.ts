import { assert, describe, test, vi } from "vitest"
import { RetrieveDataFacade, retrieveDataFacade } from "./RetrieveDataFacade"
import type { RetrieveDataFacadeOptions } from "./RetrieveDataFacade"


describe("RetrieveDataFacade Unit Tests", async () => {

  const fakeDataSuccess = JSON.parse('{"information":{"streetname":"Königstr.","streetno":"12"},"data":[{"date":"2024-07-15","unixDate":1721001600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-07-15","unixDate":1721001600,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-07-17","unixDate":1721174400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-07-22","unixDate":1721606400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-07-24","unixDate":1721779200,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-07-24","unixDate":1721779200,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-07-29","unixDate":1722211200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-07-29","unixDate":1722211200,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-07-30","unixDate":1722297600,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-07-31","unixDate":1722384000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-08-05","unixDate":1722816000,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-08-07","unixDate":1722988800,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-08-12","unixDate":1723420800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-08-12","unixDate":1723420800,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-08-14","unixDate":1723593600,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-08-14","unixDate":1723593600,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-08-19","unixDate":1724025600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-08-20","unixDate":1724112000,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-08-21","unixDate":1724198400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-08-26","unixDate":1724630400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-08-26","unixDate":1724630400,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-08-28","unixDate":1724803200,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-02","unixDate":1725235200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-09-04","unixDate":1725408000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-04","unixDate":1725408000,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-09-09","unixDate":1725840000,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-09-09","unixDate":1725840000,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-09-10","unixDate":1725926400,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-09-11","unixDate":1726012800,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-16","unixDate":1726444800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-09-18","unixDate":1726617600,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-23","unixDate":1727049600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-09-23","unixDate":1727049600,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-09-25","unixDate":1727222400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-09-25","unixDate":1727222400,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-09-30","unixDate":1727654400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-01","unixDate":1727740800,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-10-02","unixDate":1727827200,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-10-07","unixDate":1728259200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-07","unixDate":1728259200,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-10-09","unixDate":1728432000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-10-14","unixDate":1728864000,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-16","unixDate":1729036800,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-10-17","unixDate":1729123200,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2024-10-21","unixDate":1729468800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-21","unixDate":1729468800,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-10-22","unixDate":1729555200,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-10-23","unixDate":1729641600,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-10-28","unixDate":1730073600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-10-30","unixDate":1730246400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-11-05","unixDate":1730764800,"type":"residual","schedule":"W1","irregularSchedule":true},{"date":"2024-11-05","unixDate":1730764800,"type":"residual","schedule":"W2","irregularSchedule":true},{"date":"2024-11-06","unixDate":1730851200,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-11-07","unixDate":1730937600,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2024-11-11","unixDate":1731283200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-11-12","unixDate":1731369600,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-11-13","unixDate":1731456000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-11-18","unixDate":1731888000,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-11-18","unixDate":1731888000,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-11-20","unixDate":1732060800,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-11-25","unixDate":1732492800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-11-27","unixDate":1732665600,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-11-27","unixDate":1732665600,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-12-02","unixDate":1733097600,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-12-02","unixDate":1733097600,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-12-03","unixDate":1733184000,"type":"paper","schedule":"W3","irregularSchedule":false},{"date":"2024-12-04","unixDate":1733270400,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-12-09","unixDate":1733702400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-12-11","unixDate":1733875200,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-12-16","unixDate":1734307200,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-12-16","unixDate":1734307200,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2024-12-18","unixDate":1734480000,"type":"organic","schedule":"W1","irregularSchedule":false},{"date":"2024-12-18","unixDate":1734480000,"type":"recycle","schedule":"W3","irregularSchedule":false},{"date":"2024-12-21","unixDate":1734739200,"type":"residual","schedule":"W1","irregularSchedule":true},{"date":"2024-12-23","unixDate":1734912000,"type":"paper","schedule":"W3","irregularSchedule":true},{"date":"2024-12-24","unixDate":1734998400,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2024-12-30","unixDate":1735516800,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2024-12-30","unixDate":1735516800,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2025-01-02","unixDate":1735776000,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2025-01-07","unixDate":1736208000,"type":"residual","schedule":"W1","irregularSchedule":true},{"date":"2025-01-09","unixDate":1736380800,"type":"organic","schedule":"W1","irregularSchedule":true},{"date":"2025-01-13","unixDate":1736726400,"type":"residual","schedule":"W1","irregularSchedule":false},{"date":"2025-01-13","unixDate":1736726400,"type":"residual","schedule":"W2","irregularSchedule":false},{"date":"2025-01-14","unixDate":1736812800,"type":"paper","schedule":"W3","irregularSchedule":false}]}');

  const testOptions: { [index: string]: RetrieveDataFacadeOptions } = {

    validWOFilter: {
      streetname: "Königstr.",
      streetno: "10",
      typeFilter: undefined,
      format: "json"
    },

    validWOneTypeFilter: {
      streetname: "Königstr.",
      streetno: "10",
      typeFilter: ["paper"],
      format: "json"
    },

    validWTwoTypeFilter: {
      streetname: "Königstr.",
      streetno: "10",
      typeFilter: ["paper", "recycle"],
      format: "json"
    },

    validWOFilterFormatCSV: {
      streetname: "Königstr.",
      streetno: "10",
      typeFilter: undefined,
      format: "csv"
    },

    validWOFilterFormatIcal: {
      streetname: "Königstr.",
      streetno: "10",
      typeFilter: undefined,
      format: "ical"
    },

    validWOFilterFormatIcalWOptions: {
      streetname: "Königstr.",
      streetno: "10",
      typeFilter: undefined,
      format: "ical",
      formatOptions: {customSummary: "Test Summary", offsetEvent: 1, alarm: 600}
    },

    validWOFilterFormatUnsupported: {
      streetname: "Königstr.",
      streetno: "10",
      typeFilter: undefined,
      //@ts-expect-error - deliberate using wrong format
      format: "abc"
    },


  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createMockRedisService = (fakeDataGetRedis: string, fakeDataJsonGet: any, fakeDataJsonSet: any) => {
    return {
      getRedisKey: vi.fn().mockReturnValue(fakeDataGetRedis),
      jsonGET: vi.fn().mockResolvedValue(fakeDataJsonGet),
      jsonSET: vi.fn().mockResolvedValue(fakeDataJsonSet),
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createMockAwsApiService = (fakeDataToReturn: any) => {
    return {
      getAll: vi.fn().mockResolvedValue(fakeDataToReturn),
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createMockTransformDataService = (fakeDataToReturn: any) => {
    return {
      toCSV: vi.fn().mockReturnValue(fakeDataToReturn),
      toICal: vi.fn().mockReturnValue(fakeDataToReturn)
    }
  }


  test("should correctly export a default instance", () => {
    assert.instanceOf(retrieveDataFacade, RetrieveDataFacade)
  })


  describe("getAll", () => {
    test("w/ existing address in redis, should call RedisService' jsonGET once, and not call the AwsApiService' getAll", async () => {
      const mockRedisServiceInstance = createMockRedisService("address_königstr.|10", fakeDataSuccess, [ [ null, "OK" ], [ null, 1 ] ]);
      const mockAwsApiServiceInstance = createMockAwsApiService("whatever")

      //@ts-expect-error - using mocked instances
      const retrieveDataFacadeInstance = new RetrieveDataFacade(mockAwsApiServiceInstance, mockRedisServiceInstance);

      await retrieveDataFacadeInstance.getAll(testOptions.validWOFilter);

      assert.lengthOf(mockAwsApiServiceInstance.getAll.mock.calls, 0);
      assert.lengthOf(mockRedisServiceInstance.jsonGET.mock.calls, 1);
    })

    test("w/o existing address in redis, should execute refetchFromAwsApi before returning data from redis", async () => {

      const mockRedisServiceInstance = createMockRedisService("address_königstr.|10", null, [ [ null, "OK" ], [ null, 1 ] ]);
      // overwrite jsonGET method -> needs to return 'null', if value is not in redis first, then later resolve with successfull data
      mockRedisServiceInstance.jsonGET.mockResolvedValueOnce(null).mockResolvedValueOnce(fakeDataSuccess)

      const mockAwsApiServiceInstance = createMockAwsApiService("whatever");

      //@ts-expect-error - due to mocked instances
      const retrieveDataFacadeInstance = new RetrieveDataFacade(mockAwsApiServiceInstance, mockRedisServiceInstance);

      const returnedData = await retrieveDataFacadeInstance.getAll(testOptions.validWOFilter);

      // called
      assert.lengthOf(mockAwsApiServiceInstance.getAll.mock.calls, 1);
      assert.lengthOf(mockRedisServiceInstance.jsonSET.mock.calls, 1);
      // called twice: original run, then after refetchFromAwsApi was successfully
      assert.lengthOf(mockRedisServiceInstance.jsonGET.mock.calls, 2);
      assert.deepEqual(returnedData, fakeDataSuccess)

    })

    test("w/o existing address in redis, should execute refetchFromAwsApi and throw an error, if anything fails during refetchFromAwsApi", async () => {

      const mockRedisServiceInstance = createMockRedisService("address_königstr.|10", null, [ [ null, "OK" ], [ null, 1 ] ]);
      // overwrite jsonGET method -> needs to return 'null', if value is not in redis first, then later resolve with successfull data
      mockRedisServiceInstance.jsonGET.mockResolvedValueOnce(null).mockResolvedValueOnce(fakeDataSuccess)
      mockRedisServiceInstance.jsonSET.mockImplementationOnce(() => { throw new Error("FakeRedisError during JSON.SET")});
      const mockAwsApiServiceInstance = createMockAwsApiService("whatever");

      //@ts-expect-error - due to mocked instances
      const retrieveDataFacadeInstance = new RetrieveDataFacade(mockAwsApiServiceInstance, mockRedisServiceInstance);

      const errorResult = await (async () => {
        try { await retrieveDataFacadeInstance.getAll(testOptions.validWOFilter) }
        catch(error) { return error }
      })()

      //@TODO improve this -> could fail, if we don't throw an instance of Error but other Error
      assert.instanceOf(errorResult, Error)

      // called
      assert.lengthOf(mockAwsApiServiceInstance.getAll.mock.calls, 1);
      assert.lengthOf(mockRedisServiceInstance.jsonSET.mock.calls, 1);
      // called once: original run ony, since refetchFromAwsApi throws, it is not called a 2nd time
      assert.lengthOf(mockRedisServiceInstance.jsonGET.mock.calls, 1);

    })


    test("should call redis with extra filter, when one typeFilter is provided", async () => {
      const mockRedisServiceInstance = createMockRedisService("address_königstr.|10", fakeDataSuccess, [ [ null, "OK" ], [ null, 1 ] ]);
      const mockAwsApiServiceInstance = createMockAwsApiService("whatever")

      //@ts-expect-error - due to mocked instances
      const retrieveDataFacadeInstance = new RetrieveDataFacade(mockAwsApiServiceInstance, mockRedisServiceInstance);

      await retrieveDataFacadeInstance.getAll(testOptions.validWOneTypeFilter);
      // key, filter, operationId
      const expectedCall = [ 
        [ "address_königstr.|10", `$.data[?(@.type == "${testOptions.validWOneTypeFilter.typeFilter}")]`, "" ] 
      ]
      assert.deepEqual(mockRedisServiceInstance.jsonGET.mock.calls, expectedCall);

    })


    test("should call redis with extra filters, when two typeFilters are provided", async () => {
      const mockRedisServiceInstance = createMockRedisService("address_königstr.|10", fakeDataSuccess, [ [ null, "OK" ], [ null, 1 ] ]);
      const mockAwsApiServiceInstance = createMockAwsApiService("whatever")

      //@ts-expect-error - due to mocked instances
      const retrieveDataFacadeInstance = new RetrieveDataFacade(mockAwsApiServiceInstance, mockRedisServiceInstance);

      await retrieveDataFacadeInstance.getAll(testOptions.validWTwoTypeFilter);

      // key, filter, operationId
      const expectedCall = [ 
        //@ts-expect-error ignore that it could be undefined -> here it should not be
        [ 'address_königstr.|10', `$.data[?(@.type == "${testOptions.validWTwoTypeFilter.typeFilter[0]}") || (@.type == "${testOptions.validWTwoTypeFilter.typeFilter[1]}")]`, ""] 
      ]
      assert.deepEqual(mockRedisServiceInstance.jsonGET.mock.calls, expectedCall);

    })
  })

  describe("getRemaining", () => {
    test("w/ existing address in redis, should call the RedisService 1x, and not call the AwsApiService", async () => {
      const mockRedisServiceInstance = createMockRedisService("address_königstr.|10", fakeDataSuccess, [ [ null, "OK" ], [ null, 1 ] ]);
      const mockAwsApiServiceInstance = createMockAwsApiService("whatever")

      //@ts-expect-error - using mocked instances
      const retrieveDataFacadeInstance = new RetrieveDataFacade(mockAwsApiServiceInstance, mockRedisServiceInstance);

      await retrieveDataFacadeInstance.getRemaining(testOptions.validWOFilter);

      assert.lengthOf(mockAwsApiServiceInstance.getAll.mock.calls, 0);
      assert.lengthOf(mockRedisServiceInstance.jsonGET.mock.calls, 1);
    })

    test("w/o existing address in redis, should execute refetchFromAwsApi before returning data from redis", async () => {

      const mockRedisServiceInstance = createMockRedisService("address_königstr.|10", null, [ [ null, "OK" ], [ null, 1 ] ]);
      // overwrite jsonGET method -> needs to return 'null', if value is not in redis first, then later resolve with successfull data
      mockRedisServiceInstance.jsonGET.mockResolvedValueOnce(null).mockResolvedValueOnce(fakeDataSuccess)

      const mockAwsApiServiceInstance = createMockAwsApiService("whatever");

      //@ts-expect-error - using mocked instances
      const retrieveDataFacadeInstance = new RetrieveDataFacade(mockAwsApiServiceInstance, mockRedisServiceInstance);

      const returnedData = await retrieveDataFacadeInstance.getRemaining(testOptions.validWOFilter);

      // called
      assert.lengthOf(mockAwsApiServiceInstance.getAll.mock.calls, 1);
      assert.lengthOf(mockRedisServiceInstance.jsonSET.mock.calls, 1);
      // called twice: original run, then after refetchFromAwsApi was successfully
      assert.lengthOf(mockRedisServiceInstance.jsonGET.mock.calls, 2);
      assert.deepEqual(returnedData, fakeDataSuccess)

    })

    test("w/o existing address in redis, should execute refetchFromAwsApi and throw an error, if anything fails during refetchFromAwsApi", async () => {

      const mockRedisServiceInstance = createMockRedisService("address_königstr.|10", null, [ [ null, "OK" ], [ null, 1 ] ]);
      // overwrite jsonGET method -> needs to return 'null', if value is not in redis first, then later resolve with successfull data
      mockRedisServiceInstance.jsonGET.mockResolvedValueOnce(null).mockResolvedValueOnce(fakeDataSuccess)
      mockRedisServiceInstance.jsonSET.mockImplementationOnce(() => { throw new Error("FakeRedisError during JSON.SET")});
      const mockAwsApiServiceInstance = createMockAwsApiService("whatever");

      //@ts-expect-error - using mocked instances
      const retrieveDataFacadeInstance = new RetrieveDataFacade(mockAwsApiServiceInstance, mockRedisServiceInstance);

      const errorResult = await (async () => {
        try { await retrieveDataFacadeInstance.getRemaining(testOptions.validWOFilter) }
        catch(error) { return error }
      })()

      //@TODO improve this -> could fail, if we don't throw an instance of Error but other Error
      assert.instanceOf(errorResult, Error)

      // called
      assert.lengthOf(mockAwsApiServiceInstance.getAll.mock.calls, 1);
      assert.lengthOf(mockRedisServiceInstance.jsonSET.mock.calls, 1);
      // called once: original run ony, since refetchFromAwsApi throws, it is not called a 2nd time
      assert.lengthOf(mockRedisServiceInstance.jsonGET.mock.calls, 1);

    })
  })

  describe("getUpcoming", () => {
    test("should return a filtered list of only the next upcoming events/schedule type", async () => {

      const fakeDate = new Date("2024-07-24")
      vi.setSystemTime(fakeDate)

      const mockRedisServiceInstance = createMockRedisService("address_königstr.|10", fakeDataSuccess, [ [ null, "OK" ], [ null, 1 ] ]);
      const mockAwsApiServiceInstance = createMockAwsApiService("whatever")

      //@ts-expect-error - using mocked instances
      const retrieveDataFacadeInstance = new RetrieveDataFacade(mockAwsApiServiceInstance, mockRedisServiceInstance);

      const upcoming = await retrieveDataFacadeInstance.getUpcoming(testOptions.validWOFilter);

      assert.lengthOf(upcoming.data, 5);

    })
  })

  describe("Data transforming", async () => {

    test("when called with format 'csv' should call the TransformDataService's toCSV method", async () => {
      const mockRedisServiceInstance = createMockRedisService("address_königstr.|10", fakeDataSuccess, [ [ null, "OK" ], [ null, 1 ] ]);
      const mockAwsApiServiceInstance = createMockAwsApiService("whatever");
      const mockTransformDataService = createMockTransformDataService("whatever");

      //@ts-expect-error - using mocked instances
      const retrieveDataFacadeInstance = new RetrieveDataFacade(mockAwsApiServiceInstance, mockRedisServiceInstance, mockTransformDataService);

      await retrieveDataFacadeInstance.getAll(testOptions.validWOFilterFormatCSV);

      assert.lengthOf(mockTransformDataService.toCSV.mock.calls, 1)

    })

    test("when called with format 'ical' should call the TransformDataService's toICal method", async () => {
      const mockRedisServiceInstance = createMockRedisService("address_königstr.|10", fakeDataSuccess, [ [ null, "OK" ], [ null, 1 ] ]);
      const mockAwsApiServiceInstance = createMockAwsApiService("whatever");
      const mockTransformDataService = createMockTransformDataService("whatever");

      //@ts-expect-error - using mocked instances
      const retrieveDataFacadeInstance = new RetrieveDataFacade(mockAwsApiServiceInstance, mockRedisServiceInstance, mockTransformDataService);

      await retrieveDataFacadeInstance.getAll(testOptions.validWOFilterFormatIcal);

      assert.lengthOf(mockTransformDataService.toICal.mock.calls, 1)

    })

    test("when called with format 'ical' and formatOptions should call the TransformDataService's toICal method with those options", async () => {
      const mockRedisServiceInstance = createMockRedisService("address_königstr.|10", fakeDataSuccess, [ [ null, "OK" ], [ null, 1 ] ]);
      const mockAwsApiServiceInstance = createMockAwsApiService("whatever");
      const mockTransformDataService = createMockTransformDataService("whatever");

      //@ts-expect-error - using mocked instances
      const retrieveDataFacadeInstance = new RetrieveDataFacade(mockAwsApiServiceInstance, mockRedisServiceInstance, mockTransformDataService);

      await retrieveDataFacadeInstance.getAll(testOptions.validWOFilterFormatIcalWOptions);
      assert.lengthOf(mockTransformDataService.toICal.mock.calls, 1)
      assert.deepEqual(mockTransformDataService.toICal.mock.calls[0][1], testOptions.validWOFilterFormatIcalWOptions.formatOptions)

    })

    test("when called with format 'json' should return without calling TransformDataService", async () => {
      const mockRedisServiceInstance = createMockRedisService("address_königstr.|10", fakeDataSuccess, [ [ null, "OK" ], [ null, 1 ] ]);
      const mockAwsApiServiceInstance = createMockAwsApiService("whatever");
      const mockTransformDataService = createMockTransformDataService("whatever");

      //@ts-expect-error - using mocked instances
      const retrieveDataFacadeInstance = new RetrieveDataFacade(mockAwsApiServiceInstance, mockRedisServiceInstance, mockTransformDataService);
      await retrieveDataFacadeInstance.getAll(testOptions.validWOFilter);
      assert.lengthOf(mockTransformDataService.toCSV.mock.calls, 0)
      assert.lengthOf(mockTransformDataService.toICal.mock.calls, 0)

    })

    test("when called with unknown format 'abc' should default to json and return without extra transformation", async () => {
      const mockRedisServiceInstance = createMockRedisService("address_königstr.|10", fakeDataSuccess, [ [ null, "OK" ], [ null, 1 ] ]);
      const mockAwsApiServiceInstance = createMockAwsApiService("whatever");
      const mockTransformDataService = createMockTransformDataService("whatever");

      //@ts-expect-error - using mocked instances
      const retrieveDataFacadeInstance = new RetrieveDataFacade(mockAwsApiServiceInstance, mockRedisServiceInstance, mockTransformDataService);
      await retrieveDataFacadeInstance.getAll(testOptions.validWOFilterFormatUnsupported);
      assert.lengthOf(mockTransformDataService.toCSV.mock.calls, 0)
      assert.lengthOf(mockTransformDataService.toICal.mock.calls, 0)
    })
  })

})
