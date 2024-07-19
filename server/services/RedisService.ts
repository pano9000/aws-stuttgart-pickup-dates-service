import { Redis } from "ioredis";
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

export default new RedisService({
  port: +(process.env.AWSAPPENV_REDIS_SERVER_PORT as string),
  host: process.env.AWSAPPENV_REDIS_SERVER_HOST as string,
  password: process.env.AWSAPPENV_REDIS_SERVER_PASSWORD as string
})
