import { schemaQuery } from "~/server/validationSchemas/schemaQuery";
import { retrieveDataFacade } from "~/server/services/RetrieveDataFacade";


export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const validatedQuery = schemaQuery.parse(query);
    const apiData = await retrieveDataFacade.getRemaining(validatedQuery.streetname, validatedQuery.streetno);
    return apiData
  }
  catch(error) {
    errorHandler(error);
  }
})