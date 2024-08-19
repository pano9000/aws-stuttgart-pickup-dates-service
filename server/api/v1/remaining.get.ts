import { retrieveDataFacade } from "~/server/services/RetrieveDataFacade";
import getMIMEType from "~/server/utils/getMIMEType";
import getValidatedDataAndOptions from "~/server/utils/getValidatedDataAndOptions";

export default defineEventHandler(async (event) => {
  try {
    const loggerMeta = new LoggerMeta("server.api.v1.remaining", event.context.operationId);

    const query = getQuery(event);

    generalLogger.info(`Operation started`, loggerMeta.withData({query}));

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
    });

    generalLogger.info(`Operation successful`, loggerMeta.withData(apiData));

    return apiData
  }
  catch(error) {
    errorHandler(error, event.context.operationId);
  }
})