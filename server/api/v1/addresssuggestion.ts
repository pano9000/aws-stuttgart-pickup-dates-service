import { awsAddressSuggestionService } from "~/server/services/AwsAddressSuggestionService";
import { schemaQueryAddressSuggestion } from "~/server/validationSchemas/schemaQueryAddressSuggestion";

export default defineEventHandler(async (event) => {

  try {
    const query = getQuery(event);
    const { streetname, streetno } = schemaQueryAddressSuggestion.parse(query);
    return (streetno) 
      ? await awsAddressSuggestionService.getStreetNoSuggestions(streetname, streetno)
      : await awsAddressSuggestionService.getStreetNameSuggestions(streetname)
  }
  catch(error) {
    errorHandler(error);
  }
})