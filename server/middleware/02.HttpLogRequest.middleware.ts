import { httpLogger } from "../utils/winstonLogger";

export default defineEventHandler((event) => {
  httpLogger(event.node.req, event.node.res, () => {})
})