import {
  AwsApiService,
  awsApiService as defaultAwsApiService,
  SchemaAwsApiServiceResponseAll,
  SchemaAwsApiServiceEventTypeName,
  SchemaAwsApiServiceEventScheduleName,
} from "./AwsApiService";
import type { AwsApiServiceResponseAll, AwsApiServiceEvent, AwsApiServiceEventTypeName } from "./AwsApiService"
import { RedisService, redisService as defaultRedisService } from "./RedisService";
import { DateTime } from "luxon";


export class RetrieveDataFacade {

  awsApiService: AwsApiService;
  redisService: RedisService;

  constructor(awsApiService: AwsApiService = defaultAwsApiService, redisService: RedisService = defaultRedisService) {
    this.awsApiService = awsApiService;
    this.redisService = redisService;
  }


  async getAll(options: RetrieveDataFacadeOptions): Promise<AwsApiServiceResponseAll> {
    const redisKey = this.redisService.getRedisKey(options.streetname, options.streetno);
    const redisResult = await this.redisService.jsonGET(redisKey)

    if (!redisResult) {
      await this.#refetchFromAwsApi(options);
      return await this.getAll(options);
    }

    const validatedRedisResult = SchemaAwsApiServiceResponseAll.parse(redisResult)
    return validatedRedisResult;
  }

  async getRemaining(options: RetrieveDataFacadeOptions): Promise<AwsApiServiceResponseAll> {
    const redisKey = this.redisService.getRedisKey(options.streetname, options.streetno);
    const currentDate = DateTime.now().toFormat("yyyy-MM-dd");
    const filterString = `(@.date >= '${currentDate}')`;
    const redisResult = await this.redisService.jsonGET(redisKey, `$.data[?${filterString}]`);

    if (!redisResult) {
      await this.#refetchFromAwsApi(options);
      return await this.getRemaining(options);
    }

    const validatedRedisResult = SchemaAwsApiServiceResponseAll.parse(redisResult)
    return validatedRedisResult;

  }

  async getUpcoming(options: RetrieveDataFacadeOptions): Promise<AwsApiServiceResponseAll> {
    const remainingEvents = await this.getRemaining(options);
    /*
    * find first occurence of W1, residual | W2, residual | ... | W1, paper ...
    */
   // naive, and slow approach - //@TODO improve at some point
    const filteredEvents = (() => {
      const result: AwsApiServiceEvent[] = [];
      SchemaAwsApiServiceEventTypeName.options.forEach(eventName => {
        SchemaAwsApiServiceEventScheduleName.options.forEach(scheduleName => {
          const found = remainingEvents.data.find(event => event.type == eventName && event.schedule == scheduleName);
          if (found) result.push(found);
        })
      })
      return result
    })()

    remainingEvents.data = filteredEvents

    return remainingEvents;
  }

  // Fetch Full Data from AWS Stuttgart API and store in our redis DB, throws an error if anything goes wrong in any step
  async #refetchFromAwsApi(options: RetrieveDataFacadeOptions): Promise<void> {
    try {
      const redisKey = this.redisService.getRedisKey(options.streetname, options.streetno);
      const awsApiData = await this.awsApiService.getAll(options.streetname, options.streetno);
      const redisSave = await this.redisService.jsonSET(redisKey, awsApiData); // this throws, if saving was not succesful
      //@TODO set expiration date - so that refetch is forced 
      if (redisSave !== "OK") throw new Error("saving to redis failed, aborting!")
    }
    catch(error) {
      //@TODO handle errors?
      console.error("Refetch failed");
      throw error;
    }
  }

}

export const retrieveDataFacade = new RetrieveDataFacade();

export type RetrieveDataFacadeOptions = {
  streetname: string;
  streetno: string;
  typeFilter: undefined | AwsApiServiceEventTypeName[];
  operationId?: string;
}