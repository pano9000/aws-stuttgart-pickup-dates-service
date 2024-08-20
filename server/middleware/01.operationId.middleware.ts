import { uid } from "uid"

export default defineEventHandler((event) => {
  event.context.operationId = uid()
})