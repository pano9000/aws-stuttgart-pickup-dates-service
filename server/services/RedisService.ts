import { Redis, ReplyError } from "ioredis";
import type { RedisOptions } from "ioredis";

export class RedisService {

  #client: Redis;
  constructor(connectionOptions: Pick<RedisOptions, "port" | "host" | "password">, ioredis: typeof Redis = Redis) {
    this.#client = new ioredis({
      port: connectionOptions.port,
      host: connectionOptions.host,
      password: connectionOptions.password
    })

    //@TODO -> fail if ECONNREFUSED at startup, otherwise we end up in an endless loop

  }

  async jsonGET(key: string, filter?: string) {
    try {
      if (filter) {
        //@TODO implement
        return null;
      }
      const result = await this.#client.call("JSON.GET", key);
      //@TODO validate and error handle
      return result
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
  async jsonSET(key: string, value: any) {
    try {
      const result = await this.#client.call("JSON.SET", key, "$", JSON.stringify(value))
      //@TODO validate and error handle
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
