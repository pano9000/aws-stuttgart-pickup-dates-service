import { got as defaultGot, HTTPError } from "got";
import { z, ZodError } from "zod";
import type {Got} from "got";

export class AwsAddressSuggestionService {

  #apiUrlStreetName: URL;
  #apiUrlStreetNo: URL;
  #got: Got;

  // eslint-disable-next-line no-unused-private-class-members
  #logger: Console;

  constructor(
    apiUrlStreetName: string = process.env.AWSAPPENV_AWS_API_STREETNAME_URL as string, 
    apiUrlStreetNo: string = process.env.AWSAPPENV_AWS_API_STREETNO_URL as string, 
    gotClient: Got = defaultGot, 
    logger: Console = console
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

  async getStreetNameSuggestions(streetName: string) {
    this.#apiUrlStreetName.searchParams.set("street", streetName);
    return this.#executeRequest(this.#apiUrlStreetName)
  }

  async getStreetNoSuggestions(streetName: string, streetNo: string) {
    this.#apiUrlStreetNo.searchParams.set("street", streetName);
    this.#apiUrlStreetNo.searchParams.set("streetnr", streetNo);
    return this.#executeRequest(this.#apiUrlStreetNo)
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