import {
  AwsApiService,
  awsApiService as defaultAwsApiService,
  SchemaAwsApiServiceResponseAll,
  SchemaAwsApiServiceEventTypeName,
  SchemaAwsApiServiceEventScheduleName,
} from "./AwsApiService";
import type { AwsApiServiceResponseAll, AwsApiServiceEvent, AwsApiServiceEventTypeName } from "./AwsApiService"
import { RedisService, redisService as defaultRedisService } from "./RedisService";
import { TransformDataService } from "./TransformDataService";
import { DateTime } from "luxon";
import { z } from "zod";

import type { ICalOptions } from "./TransformDataService";

export class RetrieveDataFacade {

  awsApiService: AwsApiService;
  redisService: RedisService;
  transformDataService: TransformDataService;

  constructor(awsApiService: AwsApiService = defaultAwsApiService, redisService: RedisService = defaultRedisService, transformDataService: TransformDataService = TransformDataService) {
    this.awsApiService = awsApiService;
    this.redisService = redisService;
    this.transformDataService = transformDataService;
  }


  async getAll(options: RetrieveDataFacadeOptions): Promise<AwsApiServiceResponseAll> {
    const redisKey = this.redisService.getRedisKey(options.streetname, options.streetno);

    //@TODO refactor code flow
    let redisResult = ""
    if (options.typeFilter) {
      const typeFilter = options.typeFilter.map(filter => `(@.type == "${filter}")`).join(" || ");
      const filterString = this.#createFilterString([typeFilter])

      redisResult = await this.redisService.jsonGET(redisKey, filterString);

    } else {
      redisResult = await this.redisService.jsonGET(redisKey);

    }


    //const redisResult = await this.redisService.jsonGET(redisKey);

    if (!redisResult) {
      await this.#refetchFromAwsApi(options);
      return await this.getAll(options);
    }

    const validatedRedisResult = SchemaAwsApiServiceResponseAll.parse(redisResult);

    return this.#transformData(validatedRedisResult, options.format, options.formatOptions);
  }

  async getRemaining(options: RetrieveDataFacadeOptions): Promise<AwsApiServiceResponseAll> {
    const redisKey = this.redisService.getRedisKey(options.streetname, options.streetno);
    const currentDate = DateTime.now().toFormat("yyyy-MM-dd");

    const dateFilter = `(@.date >= '${currentDate}')`;
    const typeFilter = (options.typeFilter) ? options.typeFilter.map(filter => `(@.type == "${filter}")`).join(" || ") : undefined;
    const filters = (typeFilter) ? [dateFilter, typeFilter] : [dateFilter]
    const filterString = this.#createFilterString(filters)

    const redisResult = await this.redisService.jsonGET(redisKey, filterString);

    if (!redisResult) {
      await this.#refetchFromAwsApi(options);
      return await this.getRemaining(options);
    }

    const validatedRedisResult = SchemaAwsApiServiceResponseAll.parse(redisResult);
    return this.#transformData(validatedRedisResult, options.format, options.formatOptions);
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
    return this.#transformData(remainingEvents, options.format, options.formatOptions);

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

  #createFilterString(filters: string[]) {
    //e.g. $.data[?(@.date >= "2024-10-16") && ((@.type == "recycle") || (@.type == "paper"))]'
    return `$.data[?${filters.join(" && ")}]`
  }

  #transformData(originalData: AwsApiServiceResponseAll, format: RetrieveDataFacadeFormat, formatOptions?: ICalOptions) {

    switch (format) {
      case "csv":
        //@ts-ignore - @TODO check why .toCSV is not recognized correctly
        return this.transformDataService.toCSV(originalData)

      case "ical":
        //@ts-ignore - @TODO check why .toICal is not recognized correctly
        return this.transformDataService.toICal(originalData, formatOptions)

      // no transformation needed for json
      case "json":
        return originalData;

      default:
        return originalData;
    }
  }
}

export const retrieveDataFacade = new RetrieveDataFacade();

export type RetrieveDataFacadeOptions = {
  streetname: string;
  streetno: string;
  typeFilter: undefined | AwsApiServiceEventTypeName[];
  format: RetrieveDataFacadeFormat
  formatOptions?: ICalOptions
  operationId?: string;
}

export const SchemaRetrieveDataFacadeFormat = z.enum(["json", "ical", "csv"]);
export type RetrieveDataFacadeFormat = z.infer<typeof SchemaRetrieveDataFacadeFormat>;