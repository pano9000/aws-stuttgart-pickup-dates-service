import { retrieveDataFacade } from "~/server/services/RetrieveDataFacade";
import getMIMEType from "~/server/utils/getMIMEType";
import getFilename from "~/server/utils/getFilename";
import getValidatedDataAndOptions from "~/server/utils/getValidatedDataAndOptions";

//export default defineEventHandler({onRequest: [validateSchema(schemaQuery)], handler: async (event) => {

export default defineEventHandler(async (event) => {
  try {
    const loggerMeta = new LoggerMeta("server.api.v1.upcoming", event.context.operationId);

    const query = getQuery(event);

    generalLogger.info(`Operation started`, loggerMeta.withData({query}));

    const [validatedQuery, formatOptions] = getValidatedDataAndOptions(query);
    const apiData = await retrieveDataFacade.getUpcoming(
      {
        streetname: validatedQuery.streetname, 
        streetno: validatedQuery.streetno,
        typeFilter: validatedQuery.type,
        format: validatedQuery.format,
        formatOptions: formatOptions
      },
      event.context.operationId
    );

    setResponseHeaders(event, {
      "content-type": getMIMEType(validatedQuery.format),
      "content-disposition": `attachment; filename="${
        getFilename(validatedQuery.streetname, validatedQuery.streetno, validatedQuery.format)
      }"`
    });

    // @TODO: fix below -this fails for CSV/iCal type responses of course
    //generalLogger.info(`Operation successful`, loggerMeta.withData({information: apiData.information, dataExample: apiData.data?.[0]}))
    generalLogger.info(`Operation successful`, loggerMeta);

    return apiData;
  }
  catch(error) {
    errorHandler(error, event.context.operationId);
  }
})