import { retrieveDataFacade } from "~/server/services/RetrieveDataFacade";
import getMIMEType from "~/server/utils/getMIMEType";
import getValidatedDataAndOptions from "~/server/utils/getValidatedDataAndOptions";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const [validatedQuery, formatOptions] = getValidatedDataAndOptions(query)

    const apiData = await retrieveDataFacade.getRemaining({
      streetname: validatedQuery.streetname,
      streetno: validatedQuery.streetno,
      typeFilter: validatedQuery.type,
      format: validatedQuery.format,
      formatOptions: formatOptions
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