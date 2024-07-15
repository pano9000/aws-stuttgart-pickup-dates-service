import { got as defaultGot } from "got";
import type {Got} from "got";
import { DateTime } from "luxon";
import { z } from "zod";

export default class AwsAPIClient {
  #apiUrl: URL;
  #got: Got;
  #eventNames = new Map<AwsAPIRawResponseEventName,AwsAPIClientEventName>([
    ["Restmüll", "residual"],
    ["Biomüll", "organic"],
    ["Altpapier", "paper"],
    ["Gelber Sack", "recycle"],
  ]);

  constructor(apiUrl: string = process.env.AWSAPPENV_AWS_API_URL as string, gotClient: Got = defaultGot) {
    this.#got = gotClient;
    this.#apiUrl = new URL(apiUrl);
  }

  async #executeRequest(streetname: string, streetno: string, operationId: string = ""): Promise<AwsAPIRawResponse> {
    const requestUrl = new URL(this.#apiUrl);
    requestUrl.searchParams.append("street", streetname);
    requestUrl.searchParams.append("streetnr", streetno);
    const response = await this.#got(requestUrl).json();
    const validatedData = SchemaAwsAPIRawResponse.parse(response);
    return validatedData;
  }

  #transformEvent(rawEvent: AwsAPIRawResponseEvent): AwsAPIClientEvent {
    const eventName = this.#eventNames.get(rawEvent.FRAKTION);
    const date = DateTime.fromFormat(rawEvent.BASICDATE, "yyyyMMdd").toISODate();
    if (!eventName || !date) throw new Error("Transforming event data failed due to unexpected data");
    return {
      date: date,
      name: eventName,
      frequency: rawEvent.TURNUS,
      irregularSchedule: !!rawEvent.VERSCHOBEN
    }
  }


  #transformDataUpcoming(apiData: AwsAPIRawResponse) {

    const groupedData = apiData.SERVLET.DIALOG.TERMINELIST.SERVICETYPES;

    const transformedData: AwsAPIClientResponseUpcoming = {
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

  async getRaw(streetname: string, streetno: string, operationId: string = ""): Promise<AwsAPIRawResponse> {
    try {
      const data = await this.#executeRequest(streetname, streetno);
      return data
    } catch(error) {
      console.log(error)
      throw error
    }
  }
/*
  async getAll(streetname: string, streetno: string, operationId: string = ""): Promise<AwsAPIClientResponseAll> {

    try {
      const data = await this.#executeRequest(streetname, streetno);
      return data.SERVLET.DIALOG.TERMINELIST.SERVICETYPES
    } catch(error) {
      console.log(error)
      throw error
    }

  }
  */

  async getUpcoming(streetname: string, streetno: string, operationId: string = ""): Promise<AwsAPIClientResponseUpcoming> {

    try {
      const apiData = await this.#executeRequest(streetname, streetno);
      const transformedData = this.#transformDataUpcoming(apiData);

      return transformedData
    } catch(error) {

      throw error
    }
  }

}

export const awsAPIClient = new AwsAPIClient();

type AwsAPIClientResponseInformation = {
  streetname: string;
  streetno: string;
}

type AwsAPIClientResponseUpcomingData = {
  [key in AwsAPIClientEventName]: AwsAPIClientEvent
}

interface AwsAPIClientResponse {
  information: AwsAPIClientResponseInformation;
  data: any;
}

interface AwsAPIClientResponseUpcoming extends AwsAPIClientResponse {
  data: AwsAPIClientResponseUpcomingData
}

interface AwsAPIClientResponseAll extends AwsAPIClientResponse {
  data: AwsAPIClientEvent[]
}

type AwsAPIClientEventName = "residual" | "organic" | "paper" | "recycle";

interface AwsAPIClientEvent {

  /** in yyyy-MM-dd format */
  date: string;

  name: AwsAPIClientEventName;

  frequency: string;

  irregularSchedule: boolean;

}

const SchemaAwsAPIRawResponseEvent = z.object({
  /** dd.MM.YYYY format */
  DATE: z.string(),

  /** unknown, but type seem to be mixed, e.g. Restmüll sometimes is 0001, 0003, 1  */
  TYPE: z.enum(["0", "1", "2", "0001", "0003", ""]),

  /** yyyyMMdd format */
  BASICDATE: z.custom(),

  /** '' when event is in regular schedule, or '*' when event takes place out of its regular schedule, e.g. due to holidays or similar */
  VERSCHOBEN: z.union([z.literal(""), z.literal("*")]),

  /** Type of pickup event */
  FRAKTION: z.enum(["Altpapier", "Biomüll", "Gelber Sack", "Restmüll"]),

  /** Schedule of the event: weekly, bi-weekly or tri-weekly */
  TURNUS: z.enum(["01-wöchentl.", "02-wöchentl.", "03-wöchentl."]),

  /** unknown, currently always empty */
  TONNENGRUPPE: z.string(),

  /** unknown remark of some sorts, currently always empty */
  BEMERK: z.string().optional(),

  /** German localized date string 'DDDD', e.g. "Montag, 12. August 2024" */
  FULLDATE: z.string(),

  /** German localized date string 'cccc' */
  WEEKDAY: z.enum(["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"])
});

const SchemaAwsAPIRawResponseEventName = z.enum(["Restmüll", "Biomüll", "Altpapier", "Gelber Sack"]);

const SchemaAwsAPIRawResponse = z.object({
  SERVLET: z.object({
    SESSIONDATA: z.object({
      APPLICATIONNAME: z.string(),
      BUILD: z.string(),
      MODULNAME: z.string(),
      SESSIONID: z.string(),
    }),
    DIALOG: z.object({
      TERMINELIST: z.object({
        TERMIN: z.array(SchemaAwsAPIRawResponseEvent),
        SERVICETYPES: z.object({
          "Restmüll": z.array(SchemaAwsAPIRawResponseEvent),
          "Biomüll": z.array(SchemaAwsAPIRawResponseEvent),
          "Altpapier": z.array(SchemaAwsAPIRawResponseEvent),
          "Gelber Sack": z.array(SchemaAwsAPIRawResponseEvent)
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

export type AwsAPIRawResponseEventName = z.infer<typeof SchemaAwsAPIRawResponseEventName>;
export type AwsAPIRawResponse = z.infer<typeof SchemaAwsAPIRawResponse>;
export type AwsAPIRawResponseEvent = z.infer<typeof SchemaAwsAPIRawResponseEvent>;