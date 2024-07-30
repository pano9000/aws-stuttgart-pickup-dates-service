import { schemaQuery } from "~/server/validationSchemas/schemaQuery";
import { retrieveDataFacade } from "~/server/services/RetrieveDataFacade";
import getMIMEType from "~/server/utils/getMIMEType";


export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const validatedQuery = schemaQuery.parse(query);
    const apiData = await retrieveDataFacade.getAll({
      streetname: validatedQuery.streetname,
      streetno: validatedQuery.streetno,
      typeFilter: validatedQuery.type,
      format: validatedQuery.format
    });

    setResponseHeaders(event, {
      "content-type": getMIMEType(validatedQuery.format)
    })

    return apiData
  }
  catch(error) {
    errorHandler(error);
  }
})