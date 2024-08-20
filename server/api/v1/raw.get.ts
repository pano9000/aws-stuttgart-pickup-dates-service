import { awsApiService } from "~/server/services/AwsApiService";
import { schemaQuery } from "~/server/validationSchemas/schemaQuery";
//export default defineEventHandler({onRequest: [validateSchema(schemaQuery)], handler: async (event) => {

export default defineEventHandler(async (event) => {
  try {
    const loggerMeta = new LoggerMeta("server.api.v1.raw", event.context.operationId);
    const query = getQuery(event);
    generalLogger.info(`Operation started`, loggerMeta.withData({query}));
    const validatedQuery = schemaQuery.parse(query);
    const data = await awsApiService.getRaw(validatedQuery.streetname, validatedQuery.streetno, event.context.operationId);
    generalLogger.info("Operation successful", loggerMeta.withData({data}));

    return data;
  }
  catch(error) {
    errorHandler(error, event.context.operationId);
  }
})