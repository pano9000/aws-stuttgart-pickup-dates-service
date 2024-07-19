import type AwsApiService from "./AwsApiService.ts";
import { awsApiService as defaultAwsApiService } from "./AwsApiService";
import { RedisService, default as defaultRedisService } from "./RedisService";


export class RetrieveDataFacade {

  awsApiService: AwsApiService;
  redisService: RedisService;

  constructor(awsApiService: AwsApiService = defaultAwsApiService, redisService: RedisService = defaultRedisService) {
    this.awsApiService = awsApiService;
    this.redisService = redisService;
  }

  #createRedisKey(streetname: string, streetno: string) {
    return `address_${streetname}|${streetno}`.toLowerCase();
  }

  async getAll(streetname: string, streetno: string, operationId: string = ""): Promise<any> {
    const redisKey = this.#createRedisKey(streetname, streetno);
    const redisResult = await this.redisService.jsonGET(redisKey)

    if (!redisResult) {
      const awsApiData = await this.awsApiService.getAll(streetname, streetno);
      const redisSave = await this.redisService.jsonSET(redisKey, awsApiData); // this throws, if saving was not succesful
      if (redisSave !== "OK") throw new Error("saving to redis failed, aborting!")
      //@TODO set expiration date - so that refetch is forced 
      return await this.getAll(streetname, streetno);
    }
    if (typeof redisResult !== "string") throw new Error("DB did not return a valid string")
    //@TODO try/catch JSON parse?
    return JSON.parse(redisResult);
  }

}

export const retrieveDataFacade = new RetrieveDataFacade();