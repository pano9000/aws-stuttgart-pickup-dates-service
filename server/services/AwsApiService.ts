import { got as defaultGot, HTTPError } from "got";
import type {Got} from "got";
import { DateTime } from "luxon";
import { z, ZodError } from "zod";
import { AwsApiServiceError } from "./AwsApiServiceError";
import type { Logger } from "winston";
import { generalLogger, LoggerMeta } from "../utils/winstonLogger";

/**
 * Service to fetch, validate and transform data from the AWS Stuttgart API
 */
export class AwsApiService {
  #apiUrl: URL;
  #got: Got;
  #logger: Console | Logger;
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

  constructor(apiUrl: string = process.env.AWSAPPENV_AWS_API_URL as string, gotClient: Got = defaultGot, logger: Console | Logger = generalLogger) {
    this.#got = gotClient;
    this.#apiUrl = new URL(apiUrl);
    this.#logger = logger;
  }

  async #executeRequest(streetname: string, streetno: string, _operationId: string = ""): Promise<AwsApiRawResponse> {
    const requestUrl = new URL(this.#apiUrl);
    requestUrl.searchParams.append("street", streetname);
    requestUrl.searchParams.append("streetnr", streetno);
    const response = await this.#got(requestUrl).json();

    const validatedData = SchemaAwsApiRawResponse.parse(response);
    return validatedData;
  }

  #getHandledError(error: unknown, operationId: string = ""): AwsApiServiceError {
    const loggerMeta = new LoggerMeta("AwsApiService.getHandledError", operationId);
    this.#logger.error("AwsApiService Error", loggerMeta.withData({error}));

    switch (true) {
      case error instanceof ZodError:   return new AwsApiServiceError("VALIDATION", error);
      case error instanceof HTTPError:  return new AwsApiServiceError("HTTP", error);
      case error instanceof Error:      return new AwsApiServiceError("GENERIC", error);
      default:                          return new AwsApiServiceError("UNKNOWN", error);
      // error that is not an instance of Error -> that shouldn't be possible, but handle anyways
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
      const loggerMeta = new LoggerMeta("AwsApiService.getRaw", operationId);
      this.#logger.debug("Operation started", loggerMeta.withData({streetname, streetno}));

      const apiData = await this.#executeRequest(streetname, streetno);
      this.#logger.debug("Received data from API", loggerMeta.withData({eventExample: apiData.SERVLET.DIALOG.TERMINELIST.TERMIN[0]}))

      return apiData
    } catch(error) {
      throw this.#getHandledError(error, operationId);
    }
  }

  async getAll(streetname: string, streetno: string, operationId: string = ""): Promise<AwsApiServiceResponseAll> {

    try {
      const loggerMeta = new LoggerMeta("AwsApiService.getAll", operationId);
      this.#logger.debug("Operation started", loggerMeta.withData({streetname, streetno}));

      const apiData = await this.#executeRequest(streetname, streetno);
      this.#logger.debug("Received data from API", loggerMeta.withData({eventExample: apiData.SERVLET.DIALOG.TERMINELIST.TERMIN[0]}))

      const transformedData = this.#transformDataAll(apiData);
      this.#logger.debug("Transformed Data", loggerMeta.withData({transformedDataExample: transformedData.data[0]}));

      return transformedData;
    } catch(error) {
      throw this.#getHandledError(error, operationId)
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

/** Default instance */
export const awsApiService = new AwsApiService(
  process.env.AWSAPPENV_AWS_API_URL,
  defaultGot,
  generalLogger
);


type AwsApiServiceResponseUpcomingData = {
  [key in AwsApiServiceEventTypeName]: AwsApiServiceEvent
}

export type AwsApiServiceResponseInformation = {
  streetname: string;
  streetno: string;
}

interface AwsApiServiceResponse {
  information: AwsApiServiceResponseInformation;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

interface _AwsApiServiceResponseUpcoming extends AwsApiServiceResponse {
  data: AwsApiServiceResponseUpcomingData
}

export const SchemaAwsApiServiceEventTypeName = z.enum(["residual", "organic", "paper", "recycle"]);

/** weekly, bi-weekly or tri-weekly schedule codes */
export const SchemaAwsApiServiceEventScheduleName = z.enum(["W1", "W2", "W3"]);


export const SchemaAwsApiServiceEvent = z.object({
  date: z.string().describe("date in yyyy-MM-dd format"),
  unixDate: z.number(),
  type: SchemaAwsApiServiceEventTypeName,
  schedule: SchemaAwsApiServiceEventScheduleName,
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
          "Restmüll": z.array(SchemaAwsApiRawResponseEvent).optional(),
          "Biomüll": z.array(SchemaAwsApiRawResponseEvent).optional(),
          "Altpapier": z.array(SchemaAwsApiRawResponseEvent).optional(),
          "Gelber Sack": z.array(SchemaAwsApiRawResponseEvent).optional()
        })
      }),
      LOCATION: z.object({
        "IDSTANDORT": z.string(),
        "STANDORT": z.string(),
        "ID": z.number().optional(),
        "TYPE": z.union([z.literal("Adresse"), z.string()]).optional(),
        "NAME": z.string().optional(),
        "CX": z.number().optional(),
        "CY": z.number().optional(),
        "XMIN": z.number().optional(),
        "YMIN": z.number().optional(),
        "XMAX": z.number().optional(),
        "YMAX": z.number().optional(),
        "STRASSENSCHLUESSEL": z.string().optional(),
        "STRASSENNAME": z.string().optional(),
        "HAUSNUMMER": z.string().optional(),
        "MRID": z.string().optional(),
        "UUID": z.string().optional(),
        "GBE_POLIZEIR_NAME": z.string().optional(),
        "GBE_POLIZEIR_REV_ID": z.string().optional(),
        "DIESEL_VVZ_KLEIN": z.enum(["JA", "NEIN"]).optional(),
        "N": z.string().optional(),
        "Q": z.string().optional(),
        "S": z.string().optional(),
        "ADRESSE_STADTTEIL": z.string().optional(),
        "ADRESSE_STADTTEILNR": z.string().optional(),
        "ADRESSE_STADTBEZIRK": z.string().optional(),
        "ADRESSE_STADTBEZIRKNR": z.string().optional(),
        "ADRESSE_POSTLEITZAHL": z.string().optional(),
        "ADRESSE_GEMEINDENAME": z.string().optional(),
        "ADRESSE_STADTVIERTELNR": z.string().optional(),
        "ADRESSE_BAUBLOCKNR": z.string().optional(),
        "ADRESSE_BAUBLOCKSEITENR": z.string().optional(),
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
export type AwsApiServiceEventTypeName = z.infer<typeof SchemaAwsApiServiceEventTypeName>;
export type AwsApiServiceEventScheduleName = z.infer<typeof SchemaAwsApiServiceEventScheduleName>;
