import { got as defaultGot } from "got";
import { z } from "zod";
import type {Got} from "got";
import type { Logger } from "winston";
import { generalLogger } from "../utils/winstonLogger";

export class AwsAddressSuggestionService {

  #apiUrlStreetName: URL;
  #apiUrlStreetNo: URL;
  #got: Got;

  #logger: Console | Logger;

  constructor(
    apiUrlStreetName: string = process.env.AWSAPPENV_AWS_API_STREETNAME_URL as string, 
    apiUrlStreetNo: string = process.env.AWSAPPENV_AWS_API_STREETNO_URL as string, 
    gotClient: Got = defaultGot, 
    logger: Console | Logger = generalLogger
  ) {
    this.#got = gotClient;
    this.#apiUrlStreetName = new URL(apiUrlStreetName);
    this.#apiUrlStreetNo = new URL(apiUrlStreetNo);
    this.#logger = logger;
  }

  async #executeRequest(apiUrl: URL) {
    const response = await this.#got(apiUrl).json();
    const validatedData = SchemaAwsApiAddressSuggestionRawResponse.parse(response);
    return this.#transformToSuggestion(validatedData)
  }

  async getStreetNameSuggestions(streetName: string, operationId: string = "") {
    const loggerMeta = new LoggerMeta("AwsAddressSuggestionService.getStreetNameSuggestions", operationId);
    this.#logger.debug("Operation started", loggerMeta.withData({streetName}));
    this.#apiUrlStreetName.searchParams.set("street", streetName);


    const suggestions = await this.#executeRequest(this.#apiUrlStreetName);
    this.#logger.debug("Operation successful", loggerMeta.withData({suggestions}));
    return suggestions
  }

  async getStreetNoSuggestions(streetName: string, streetNo: string, operationId: string = "") {
    const loggerMeta = new LoggerMeta("AwsAddressSuggestionService.getStreetNoSuggestions", operationId);
    this.#logger.debug("Operation started", loggerMeta.withData({streetName, streetNo}));

    this.#apiUrlStreetNo.searchParams.set("street", streetName);
    this.#apiUrlStreetNo.searchParams.set("streetnr", streetNo);


    const suggestions = await this.#executeRequest(this.#apiUrlStreetNo);
    this.#logger.debug("Operation successful", loggerMeta.withData({suggestions}));
    return suggestions
  }


  #transformToSuggestion(rawData: AwsApiAddressSuggestionRawResponse) {
    return rawData.suggestions.map(suggestion => suggestion.value)
  }

}


export const awsAddressSuggestionService = new AwsAddressSuggestionService();


const SchemaAwsApiAddressSuggestionRawResponse = z.object({
  suggestions: z.array(
    z.object({
      value: z.string(),
      data: z.string()
    })
  )
})

type AwsApiAddressSuggestionRawResponse = z.infer<typeof SchemaAwsApiAddressSuggestionRawResponse>