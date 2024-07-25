import { AwsApiService, awsApiService as defaultAwsApiService } from "./AwsApiService";
import { RedisService, redisService as defaultRedisService } from "./RedisService";


export class RetrieveDataFacade {

  awsApiService: AwsApiService;
  redisService: RedisService;

  constructor(awsApiService: AwsApiService = defaultAwsApiService, redisService: RedisService = defaultRedisService) {
    this.awsApiService = awsApiService;
    this.redisService = redisService;
  }


  async getAll(streetname: string, streetno: string, operationId: string = ""): Promise<any> {
    const redisKey = this.redisService.getRedisKey(streetname, streetno);
    const redisResult = await this.redisService.jsonGET(redisKey)

    if (!redisResult) {
      await this.#refetchFromAwsApi(streetname, streetno);
      return await this.getAll(streetname, streetno);
    }

    if (typeof redisResult !== "string") throw new Error("DB did not return a valid string")
    //@TODO try/catch JSON parse?
    return JSON.parse(redisResult);
  }

    // Fetch Full Data from AWS Stuttgart API and store in our redis DB, throws an error if anything goes wrong in any step
    async #refetchFromAwsApi(streetname: string, streetno: string, operationId: string = ""): Promise<void> {
      try {
        const redisKey = this.redisService.getRedisKey(streetname, streetno);
        const awsApiData = await this.awsApiService.getAll(streetname, streetno);
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