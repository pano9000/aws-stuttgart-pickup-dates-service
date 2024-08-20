import {
  awsApiService as defaultAwsApiService,
  SchemaAwsApiServiceResponseAll,
  SchemaAwsApiServiceEventTypeName,
  SchemaAwsApiServiceEventScheduleName,
} from "./AwsApiService";
import { redisService as defaultRedisService } from "./RedisService";
import { TransformDataService } from "./TransformDataService";
import { DateTime } from "luxon";
import { z } from "zod";

import type { AwsApiService, AwsApiServiceResponseAll, AwsApiServiceEvent, AwsApiServiceEventTypeName } from "./AwsApiService"
import type { RedisService } from "./RedisService";
import type { CSVOptions, ICalOptions } from "./TransformDataService";


export class RetrieveDataFacade {

  awsApiService: AwsApiService;
  redisService: RedisService;
  transformDataService: TransformDataService;

  constructor(awsApiService: AwsApiService = defaultAwsApiService, redisService: RedisService = defaultRedisService, transformDataService: TransformDataService = TransformDataService) {
    this.awsApiService = awsApiService;
    this.redisService = redisService;
    this.transformDataService = transformDataService;
  }

  async getAll(options: RetrieveDataFacadeOptions, operationId: string = ""): Promise<AwsApiServiceResponseAll> {

    const validatedRedisResult = await this.#fetchDataFromRedis(
      options, 
      (() => {
        return (options.typeFilter) 
          ? this.#createFilterString([this.#createTypeFilter(options.typeFilter)])
          : undefined;
      })(),
      operationId
    )

    return this.#transformData(validatedRedisResult, options.format, options.formatOptions);
  }

  async getRemaining(options: RetrieveDataFacadeOptions, operationId: string = ""): Promise<AwsApiServiceResponseAll> {
    const validatedRedisResult = await this.#fetchDataFromRedis(
      options, 
      (() => {
        const dateFilter = this.#createDateFilter();
        const typeFilter = (options.typeFilter) ? this.#createTypeFilter(options.typeFilter) : undefined;
        const filters = (typeFilter) ? [dateFilter, typeFilter] : [dateFilter];
        return this.#createFilterString(filters);
      })(),
      operationId
    );

    return this.#transformData(validatedRedisResult, options.format, options.formatOptions);
  }

  async getUpcoming(options: RetrieveDataFacadeOptions, operationId: string = ""): Promise<AwsApiServiceResponseAll> {
  
    const validatedRedisResult = await this.#fetchDataFromRedis(
      options, 
      (() => {
        const dateFilter = this.#createDateFilter();
        const typeFilter = (options.typeFilter) ? this.#createTypeFilter(options.typeFilter) : undefined;
        const filters = (typeFilter) ? [dateFilter, typeFilter] : [dateFilter];
        return this.#createFilterString(filters);
      })(),
      operationId
    );

    /*
    * find first occurence of W1, residual | W2, residual | ... | W1, paper ...
    */
   // naive, and slow approach - //@TODO improve at some point
    const filteredEvents = (() => {
      const result: AwsApiServiceEvent[] = [];
      SchemaAwsApiServiceEventTypeName.options.forEach(eventName => {
        SchemaAwsApiServiceEventScheduleName.options.forEach(scheduleName => {
          const found = validatedRedisResult.data.find(event => event.type == eventName && event.schedule == scheduleName);
          if (found) result.push(found);
        })
      })
      return result
    })()

    validatedRedisResult.data = filteredEvents
    return this.#transformData(validatedRedisResult, options.format, options.formatOptions);

  }
  
  async #fetchDataFromRedis(options: RetrieveDataFacadeOptions, filterString: string | undefined, operationId: string = ""): Promise<AwsApiServiceResponseAll> {
    const redisKey = this.redisService.getRedisKey(options.streetname, options.streetno);
    const redisResult = await this.redisService.jsonGET(redisKey, filterString, operationId);

    if (!redisResult) {
      await this.#refetchFromAwsApi(options);
      return await this.#fetchDataFromRedis(options, filterString)
    }

    const validatedRedisResult = SchemaAwsApiServiceResponseAll.parse(redisResult);
    return validatedRedisResult;
  }

  // Fetch Full Data from AWS Stuttgart API and store in our redis DB, throws an error if anything goes wrong in any step
  async #refetchFromAwsApi(options: RetrieveDataFacadeOptions, operationId: string = ""): Promise<void> {
    try {
      const redisKey = this.redisService.getRedisKey(options.streetname, options.streetno);
      const awsApiData = await this.awsApiService.getAll(options.streetname, options.streetno, operationId);
      const redisSave = await this.redisService.jsonSET(redisKey, awsApiData, operationId); // this throws, if saving was not succesful
      //@TODO set expiration date - so that refetch is forced 
      if (redisSave !== "OK") throw new Error("saving to redis failed, aborting!")
    }
    catch(error) {
      //@TODO handle errors?
      console.error("Refetch failed");
      throw error;
    }
  }

  #createDateFilter(): string {
    const currentDate = DateTime.now().toFormat("yyyy-MM-dd");
    return `(@.date >= '${currentDate}')`;
  }

  #createTypeFilter(typeFilter: AwsApiServiceEventTypeName[]): string {
    return typeFilter.map(filter => `(@.type == "${filter}")`).join(" || ");
  }

  #createFilterString(filters: string[]) {
    //e.g. $.data[?(@.date >= "2024-10-16") && ((@.type == "recycle") || (@.type == "paper"))]'
    return `$.data[?${filters.join(" && ")}]`
  }

  #transformData(originalData: AwsApiServiceResponseAll, format: RetrieveDataFacadeFormat, formatOptions?: ICalOptions | CSVOptions) {

    switch (format) {
      case "csv":
        //@ts-expect-error - @TODO check why .toCSV is not recognized correctly
        return this.transformDataService.toCSV(originalData, formatOptions)

      case "ical":
        //@ts-expect-error - @TODO check why .toICal is not recognized correctly
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