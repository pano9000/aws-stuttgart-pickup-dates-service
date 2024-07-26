import { schemaQuery } from "~/server/validationSchemas/schemaQuery";
import { retrieveDataFacade } from "~/server/services/RetrieveDataFacade";

//export default defineEventHandler({onRequest: [validateSchema(schemaQuery)], handler: async (event) => {

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const validatedQuery = schemaQuery.parse(query);
    const data = await retrieveDataFacade.getUpcoming(validatedQuery.streetname, validatedQuery.streetno);
    return data;
  }
  catch(error) {
    errorHandler(error);
  }
})