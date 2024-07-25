import { got as defaultGot, HTTPError } from "got";
import type {Got} from "got";
import { DateTime } from "luxon";
import { z, ZodError } from "zod";
import { AwsApiServiceError } from "./AwsApiServiceError";

/**
 * Service to fetch, validate and transform data from the AWS Stuttgart API
 */
export default class AwsApiService {
  #apiUrl: URL;
  #got: Got;
  #logger: Console;
  #typeNames = new Map<AwsApiRawResponseEventTypeName,AwsApiServiceEventTypeName>([
    ["Restmüll", "residual"],
    ["Biomüll", "organic"],
    ["Altpapier", "paper"],
    ["Gelber Sack", "recycle"],
  ]);
  #scheduleNames = new Map<AwsApiRawResponseEventScheduleType, AwsApiServiceEventScheduleName>([
    ["01-wöchentl.", "W1"],
    ["02-wöchentl.", "W2"],
    ["03-wöchentl.", "W3"]
  ]);

  constructor(apiUrl: string = process.env.AWSAPPENV_AWS_API_URL as string, gotClient: Got = defaultGot, logger: Console = console) {
    this.#got = gotClient;
    this.#apiUrl = new URL(apiUrl);
    this.#logger = logger;
  }

  async #executeRequest(streetname: string, streetno: string, operationId: string = ""): Promise<AwsApiRawResponse> {
    const requestUrl = new URL(this.#apiUrl);
    requestUrl.searchParams.append("street", streetname);
    requestUrl.searchParams.append("streetnr", streetno);
    const response = await this.#got(requestUrl).json();
    const validatedData = SchemaAwsApiRawResponse.parse(response);
    return validatedData;
  }

  #getHandledError(error: unknown): AwsApiServiceError {

    if (error instanceof ZodError) {
      return new AwsApiServiceError("validation", error);
    }

    else if(error instanceof HTTPError) {
      return new AwsApiServiceError("http", error);
    }

    else if(error instanceof Error) {
      return new AwsApiServiceError("generic", error);
    }

    else {
      // error that is not an instance of Error -> that shouldn't be possible, but handle anyways
      return new AwsApiServiceError("generic", error);
    }
  }

  #transformEvent(rawEvent: AwsApiRawResponseEvent): AwsApiServiceEvent {
    const eventName = this.#typeNames.get(rawEvent.FRAKTION);
    const scheduleName = this.#scheduleNames.get(rawEvent.TURNUS);
    const date = DateTime.fromFormat(rawEvent.BASICDATE, "yyyyMMdd").toISODate();
    if (!eventName || !date || !scheduleName) throw new Error("Transforming event data failed due to unexpected data");

    return {
      date: date,
      unixDate: DateTime.fromISO(date, {zone: "utc"}).toUnixInteger(),
      type: eventName,
      schedule: scheduleName,
      irregularSchedule: !!rawEvent.VERSCHOBEN
    }
  }

  #transformDataAll(apiData: AwsApiRawResponse) {
    const apiEventData = apiData.SERVLET.DIALOG.TERMINELIST.TERMIN;
    const transformedEvents = apiEventData.map(event => this.#transformEvent(event));

    //lexicographical order by date earliest to last
    transformedEvents.sort((a, b) => {
      if (a.date > b.date) return 1;
      if (a.date < b.date) return -1;
      return 0
    })

    return {
      information: {
        streetname: apiData.SERVLET.DIALOG.LOCATION.STRASSENNAME,
        streetno: apiData.SERVLET.DIALOG.LOCATION.HAUSNUMMER
      },
      data: transformedEvents
    }

  }

/*
  #transformDataUpcoming(apiData: AwsApiRawResponse) {

    const groupedData = apiData.SERVLET.DIALOG.TERMINELIST.SERVICETYPES;

    const transformedData: AwsApiServiceResponseUpcoming = {
      information: {
        streetname: apiData.SERVLET.DIALOG.LOCATION.STRASSENNAME,
        streetno: apiData.SERVLET.DIALOG.LOCATION.HAUSNUMMER
      },
      data: {
        // expecting data to be correctly sorted by API - should be checked, if that really is always the case
        // or just go the extra step and sort ourselves
        residual: this.#transformEvent(groupedData.Restmüll[0]),
        organic: this.#transformEvent(groupedData.Biomüll[0]),
        paper: this.#transformEvent(groupedData.Altpapier[0]),
        recycle: this.#transformEvent(groupedData["Gelber Sack"][0])
      }
    }

    return transformedData;
  }
*/
  async getRaw(streetname: string, streetno: string, operationId: string = ""): Promise<AwsApiRawResponse> {
    try {
      const apiData = await this.#executeRequest(streetname, streetno);
      return apiData
    } catch(error) {
      throw this.#getHandledError(error)
    }
  }

  async getAll(streetname: string, streetno: string, operationId: string = ""): Promise<AwsApiServiceResponseAll> {

    try {
      const apiData = await this.#executeRequest(streetname, streetno);
      return this.#transformDataAll(apiData);
    } catch(error) {
      throw this.#getHandledError(error)
    }
  }

/*
  async getUpcoming(streetname: string, streetno: string, operationId: string = ""): Promise<AwsApiServiceResponseUpcoming> {

    try {
      const apiData = await this.#executeRequest(streetname, streetno);
      const transformedData = this.#transformDataUpcoming(apiData);

      return transformedData
    } catch(error) {
      console.log(error)
      throw error
    }
  }
*/
}

export const awsApiService = new AwsApiService();




type AwsApiServiceResponseUpcomingData = {
  [key in AwsApiServiceEventTypeName]: AwsApiServiceEvent
}

export type AwsApiServiceResponseInformation = {
  streetname: string;
  streetno: string;
}

interface AwsApiServiceResponse {
  information: AwsApiServiceResponseInformation;
  data: any;
}

interface AwsApiServiceResponseUpcoming extends AwsApiServiceResponse {
  data: AwsApiServiceResponseUpcomingData
}


export const SchemaAwsApiServiceEventTypeName = z.enum(["residual", "organic", "paper", "recycle"]);
export type AwsApiServiceEventTypeName = z.infer<typeof SchemaAwsApiServiceEventTypeName>;

/** weekly, bi-weekly or tri-weekly schedule codes */
export type AwsApiServiceEventScheduleName = "W1" | "W2" | "W3";

export const SchemaAwsApiServiceEvent = z.object({
  date: z.string().describe("date in yyyy-MM-dd format"),
  unixDate: z.number(),
  type: SchemaAwsApiServiceEventTypeName,
  schedule: z.custom<AwsApiServiceEventScheduleName>(),
  irregularSchedule: z.boolean()
})


const SchemaAwsApiServiceResponseInformation = z.object({
  streetname: z.string(),
  streetno: z.string()
});

export const SchemaAwsApiServiceResponseAll = z.object({
  information: SchemaAwsApiServiceResponseInformation,
  data: z.array(SchemaAwsApiServiceEvent)
})


const SchemaAwsApiRawResponseEventTypeName = z.enum([ "Altpapier", "Biomüll", "Gelber Sack", "Restmüll"]);
const SchemaAwsApiRawResponseEventScheduleType = z.enum(["01-wöchentl.", "02-wöchentl.", "03-wöchentl."]);

const SchemaAwsApiRawResponseEvent = z.object({
  /** dd.MM.YYYY format */
  DATE: z.string(), //@TODO add custom validator

  /** unknown, but type seem to be mixed, e.g. Restmüll sometimes is 0001, 0003, 1 || does it have to do with schedule maybe? */
  TYPE: z.enum(["0", "1", "2", "0001", "0003", ""]),

  /** yyyyMMdd format */
  BASICDATE: z.string(), //@TODO add custom validator

  /** '' when event is in regular schedule, or '*' when event takes place out of its regular schedule, e.g. due to holidays or similar */
  VERSCHOBEN: z.union([z.literal(""), z.literal("*")]),

  /** Type of pickup event */
  FRAKTION: SchemaAwsApiRawResponseEventTypeName,

  /** Schedule of the event: weekly, bi-weekly or tri-weekly */
  TURNUS: SchemaAwsApiRawResponseEventScheduleType,

  /** unknown, currently always empty */
  TONNENGRUPPE: z.string(),

  /** unknown remark of some sorts, currently always empty */
  BEMERK: z.string().optional(),

  /** German localized date string 'DDDD', e.g. "Montag, 12. August 2024" */
  FULLDATE: z.string(),

  /** German localized date string 'cccc' */
  WEEKDAY: z.enum(["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"])
});

const SchemaAwsApiRawResponse = z.object({
  SERVLET: z.object({
    SESSIONDATA: z.object({
      APPLICATIONNAME: z.string(),
      BUILD: z.string(),
      MODULNAME: z.string(),
      SESSIONID: z.string(),
    }),
    DIALOG: z.object({
      TERMINELIST: z.object({
        TERMIN: z.array(SchemaAwsApiRawResponseEvent),
        SERVICETYPES: z.object({
          "Restmüll": z.array(SchemaAwsApiRawResponseEvent),
          "Biomüll": z.array(SchemaAwsApiRawResponseEvent),
          "Altpapier": z.array(SchemaAwsApiRawResponseEvent),
          "Gelber Sack": z.array(SchemaAwsApiRawResponseEvent)
        })
      }),
      LOCATION: z.object({
        "IDSTANDORT": z.string(),
        "STANDORT": z.string(),
        "ID": z.number(),
        "TYPE": z.union([z.literal("Adresse"), z.string()]),
        "NAME": z.string(),
        "CX": z.number(),
        "CY": z.number(),
        "XMIN": z.number(),
        "YMIN": z.number(),
        "XMAX": z.number(),
        "YMAX": z.number(),
        "STRASSENSCHLUESSEL": z.string(),
        "STRASSENNAME": z.string(),
        "HAUSNUMMER": z.string(),
        "MRID": z.string(),
        "UUID": z.string(),
        "GBE_POLIZEIR_NAME": z.string(),
        "GBE_POLIZEIR_REV_ID": z.string(),
        "DIESEL_VVZ_KLEIN": z.enum(["JA", "NEIN"]),
        "N": z.string(),
        "Q": z.string(),
        "S": z.string(),
        "ADRESSE_STADTTEIL": z.string(),
        "ADRESSE_STADTTEILNR": z.string(),
        "ADRESSE_STADTBEZIRK": z.string(),
        "ADRESSE_STADTBEZIRKNR": z.string(),
        "ADRESSE_POSTLEITZAHL": z.string(),
        "ADRESSE_GEMEINDENAME": z.string(),
        "ADRESSE_STADTVIERTELNR": z.string(),
        "ADRESSE_BAUBLOCKNR": z.string(),
        "ADRESSE_BAUBLOCKSEITENR": z.string(),
      })

    })

  })
});

export type AwsApiServiceResponseAll = z.infer<typeof SchemaAwsApiServiceResponseAll>;

export type AwsApiRawResponseEventTypeName = z.infer<typeof SchemaAwsApiRawResponseEventTypeName>;
export type AwsApiRawResponse = z.infer<typeof SchemaAwsApiRawResponse>;
export type AwsApiRawResponseEvent = z.infer<typeof SchemaAwsApiRawResponseEvent>;
export type AwsApiRawResponseEventScheduleType = z.infer<typeof SchemaAwsApiRawResponseEventScheduleType>;

export type AwsApiServiceEvent = z.infer<typeof SchemaAwsApiServiceEvent>;
