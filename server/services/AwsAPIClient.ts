import { got as defaultGot } from "got";
import type {Got} from "got";
import { DateTime } from "luxon";
import { z } from "zod";

export default class AwsAPIClient {
  #apiUrl: URL;
  #got: Got;
  hasAddressSet: boolean = false;
  #eventNames = new Map<AwsAPIRawResponseEventName,AwsAPIClientEventName>([
    ["Restmüll", "residual"],
    ["Biomüll", "organic"],
    ["Altpapier", "paper"],
    ["Gelber Sack", "recycle"],
  ]);;

  constructor(apiUrl: string = process.env.AWSAPPENV_AWS_API_URL as string, gotClient: Got = defaultGot) {
    this.#got = gotClient;
    this.#apiUrl = new URL(apiUrl);
  }

  async #executeRequest(operationId: string = ""): Promise<AwsAPIRawResponse> {
    if (!this.hasAddressSet) {
      throw new Error("No address set, please call setAddress first");
    }
    const response = await this.#got(this.#apiUrl).json() as AwsAPIRawResponse;
    //TODO validate
    return response;
  }

  #transformEvent(rawEvent: AwsAPIRawResponseEvent): AwsAPIClientEvent {
    // TODO: get rid of "as"
    return {
      date: DateTime.fromFormat(rawEvent.BASICDATE, "yyyyMMdd").toISODate() as string,
      name: this.#eventNames.get(rawEvent.FRAKTION) as AwsAPIClientEventName,
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
        residual: this.#transformEvent(groupedData.Restmüll.at(0) as AwsAPIRawResponseEvent),
        organic: this.#transformEvent(groupedData.Biomüll.at(0) as AwsAPIRawResponseEvent),
        paper: this.#transformEvent(groupedData.Altpapier.at(0) as AwsAPIRawResponseEvent),
        recycle: this.#transformEvent(groupedData["Gelber Sack"].at(0) as AwsAPIRawResponseEvent)
      }
    }


    return transformedData;
  }

  setAddress(streetname: string, streetno: string) {
    this.#apiUrl.searchParams.append("street", streetname);
    this.#apiUrl.searchParams.append("streetnr", streetno);
    this.hasAddressSet = true;
    return this
  }

  async getRaw(operationId: string = ""): Promise<AwsAPIRawResponse> {
    try {
      const data = await this.#executeRequest();
      return data
    } catch(error) {
      console.log(error)
      throw error
    }
  }
/*
  async getAll(operationId: string = ""): Promise<AwsAPIClientResponseAll> {

    try {
      const data = await this.#executeRequest();
      return data.SERVLET.DIALOG.TERMINELIST.SERVICETYPES
    } catch(error) {
      console.log(error)
      throw error
    }

  }
  */

  async getUpcoming(operationId: string = ""): Promise<AwsAPIClientResponseUpcoming> {

    try {
      const data = await this.#executeRequest();
      const transformedData = this.#transformDataUpcoming(data);

      return transformedData
    } catch(error) {

      throw error
    }
  }

}


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