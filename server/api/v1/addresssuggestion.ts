import { awsAddressSuggestionService } from "~/server/services/AwsAddressSuggestionService";
import { generalLogger, LoggerMeta } from "~/server/utils/winstonLogger";
import { schemaQueryAddressSuggestion } from "~/server/validationSchemas/schemaQueryAddressSuggestion";

export default defineEventHandler(async (event) => {

  try {
    const loggerMeta = new LoggerMeta("server.api.v1.addressSuggestion", event.context.operationId);
    const query = getQuery(event);
    generalLogger.info(`Operation started`, loggerMeta.withData({query}));
    const { streetname, streetno } = schemaQueryAddressSuggestion.parse(query);

    const suggestion = (streetno) 
      ? await awsAddressSuggestionService.getStreetNoSuggestions(streetname, streetno)
      : await awsAddressSuggestionService.getStreetNameSuggestions(streetname);

    generalLogger.info(`Operation successful`, loggerMeta.withData({suggestion}));
    return suggestion;
  }
  catch(error) {
    errorHandler(error, event.context.operationId);
  }
})