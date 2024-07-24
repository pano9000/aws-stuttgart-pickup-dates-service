import { awsApiService } from "~/server/services/AwsApiService";
import { schemaQuery } from "~/server/validationSchemas/schemaQuery";
//export default defineEventHandler({onRequest: [validateSchema(schemaQuery)], handler: async (event) => {

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const validatedQuery = schemaQuery.parse(query);
    const data = await awsApiService.getRaw(validatedQuery.streetname, validatedQuery.streetno);
    return data;
  }
  catch(error) {
    errorHandler(error);
  }
})