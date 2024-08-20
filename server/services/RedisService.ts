import { Redis, ReplyError } from "ioredis";
import type { RedisOptions } from "ioredis";
import type { Logger } from "winston";
import { generalLogger, LoggerMeta } from "../utils/winstonLogger";

export class RedisService {

  #client: Redis;
  #logger: Console | Logger
  constructor(
    connectionOptions: Pick<RedisOptions, "port" | "host" | "password">, 
    ioredis: typeof Redis = Redis,
    logger: Console | Logger = generalLogger
  ) {
    this.#client = new ioredis({
      port: connectionOptions.port,
      host: connectionOptions.host,
      password: connectionOptions.password
    })

    this.#logger = logger;

    //@TODO -> fail if ECONNREFUSED at startup, otherwise we end up in an endless loop

  }

  getRedisKey(streetname: string, streetno: string) {
    return `address_${streetname}|${streetno}`.toLowerCase();
  }

  async jsonGET(key: string, filter?: string, operationId: string = "") {
    try {
      const loggerMeta = new LoggerMeta("RedisService.jsonGET", operationId);
      this.#logger.debug("Operation started", loggerMeta.withData({key, filter}));

      if (filter) {
        // two calls, because otherwise redis behaves weird and makes us do extra work to transform the data back to its original state
        // e.g. return information as array, and renames the data property to the used filter...
        const resultInformation = await this.#client.call("JSON.GET", key, "information") as string;
        if (resultInformation === null) return null; // item not found -> exit early
        if (typeof resultInformation !== "string") throw new Error(`Received back an unexpected type of data. Expected string or null, but got ${typeof resultInformation}`);

        const resultData = await this.#client.call("JSON.GET", key, filter) as string;
        if (resultData === null) return null; // item not found -> exit early
        if (typeof resultData !== "string") throw new Error(`Received back an unexpected type of data. Expected string or null, but got ${typeof resultData}`);

        const output = {
          information: JSON.parse(resultInformation),
          data: JSON.parse(resultData)
        }

        return output;
      }

      const result = await this.#client.call("JSON.GET", key);
      if (typeof result !== "string" && result !== null) throw new Error(`Received back an unexpected type of data. Expected string or null, but got ${typeof result}`)

      this.#logger.debug("Operation successful", loggerMeta);

      //@ts-expect-error -> null is a valid JSON value, that can be parsed (into null) but JSON.parse complains about it
      return JSON.parse(result)
    }
    catch(error) {
      //@TODO implement error handling

      if (error instanceof ReplyError) {
        console.error("redis error", error)
        throw error
      }

      else if (error instanceof Error) {
        console.error("redis error other", error)
        throw error
      }

      else {
        console.error("redis unknown other error", error)
        throw error
      }
    }
  }

  //@TODO: check if there is a type for "JSON parseable thing"?
  async jsonSET(key: string, value: any, operationId = "") {
    try {
      const loggerMeta = new LoggerMeta("RedisService.jsonSET", operationId);
      this.#logger.debug("Operation started", loggerMeta.withData({key, value}));

      const result = await this.#client.call("JSON.SET", key, "$", JSON.stringify(value))
      //@TODO validate and error handle

      this.#logger.debug("Operation successful", loggerMeta);

      return result
    }
    catch(error) {
      console.error(error)
    }
  }

}

export const redisService = new RedisService({
  port: +(process.env.AWSAPPENV_REDIS_SERVER_PORT as string),
  host: process.env.AWSAPPENV_REDIS_SERVER_HOST as string,
  password: process.env.AWSAPPENV_REDIS_SERVER_PASSWORD as string
})
