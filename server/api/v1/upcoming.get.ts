import { schemaQuery } from "~/server/validationSchemas/schemaQuery";
import { retrieveDataFacade } from "~/server/services/RetrieveDataFacade";

//export default defineEventHandler({onRequest: [validateSchema(schemaQuery)], handler: async (event) => {

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const validatedQuery = schemaQuery.parse(query);
    const apiData = await retrieveDataFacade.getUpcoming({
      streetname: validatedQuery.streetname, 
      streetno: validatedQuery.streetno,
      typeFilter: validatedQuery.type
    });
    return apiData;
  }
  catch(error) {
    errorHandler(error);
  }
})