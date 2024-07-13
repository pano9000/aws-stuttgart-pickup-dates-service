import { got as defaultGot } from "got";
import type {Got} from "got";
import { DateTime } from "luxon";

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

interface AwsAPIRawResponseEvent {
  /** dd.MM.YYYY format */
  DATE: string;

  /** unknown, but type seem to be mixed, e.g. Restmüll sometimes is 0001, 0003, 1  */
  TYPE: "0" | "1" | "2" | "0001" | "0003" | "",

  /** yyyyMMdd format */
  BASICDATE: string;

  /** '' when event is in regular schedule, or '*' when event takes place out of its regular schedule, e.g. due to holidays or similar */
  VERSCHOBEN: "" | "*";

  /** Type of pickup event */
  FRAKTION: "Altpapier" | "Biomüll" | "Gelber Sack" | "Restmüll";

  /** Schedule of the event: weekly, bi-weekly or tri-weekly */
  TURNUS: "01-wöchentl." | "02-wöchentl." | "03-wöchentl.";

  /** unknown, currently always empty */
  TONNENGRUPPE: string;

  /** unknown remark of some sorts, currently always empty */
  BEMERK: string;

  /** German localized date string 'DDDD', e.g. "Montag, 12. August 2024" */
  FULLDATE: string;

  /** German localized date string 'cccc' */
  WEEKDAY: "Montag" | "Dienstag" | "Mittwoch" | "Donnerstag" | "Freitag";
}

type AwsAPIRawResponseEventName = "Restmüll" | "Biomüll" | "Altpapier" | "Gelber Sack";

interface AwsAPIRawResponse {
  SERVLET: {
    SESSIONDATA: {
      APPLICATIONNAME: string;
      BUILD: string;
      MODULNAME: string;
      SESSIONID: string;
    }
    DIALOG: {
      TERMINELIST: {
        /** Array of AwsAPIRawResponseEvent ordered by Servicetype first then date */
        TERMIN: AwsAPIRawResponseEvent[],
        SERVICETYPES: {
          [key in AwsAPIRawResponseEventName]: AwsAPIRawResponseEvent[]
        }
      },
      LOCATION: {
        "IDSTANDORT": string;
        "STANDORT": string;
        "ID": number;
        "TYPE": "Adresse" | string;
        "NAME": string;
        "CX": number;
        "CY": number;
        "XMIN": number;
        "YMIN": number;
        "XMAX": number;
        "YMAX": number;
        "STRASSENSCHLUESSEL": string;
        "STRASSENNAME": string;
        "HAUSNUMMER": string;
        "MRID": string;
        "UUID": string;
        "GBE_POLIZEIR_NAME": string;
        "GBE_POLIZEIR_REV_ID": string;
        "DIESEL_VVZ_KLEIN": "JA" | "NEIN";
        "N": string;
        "Q": string;
        "S": string;
        "ADRESSE_STADTTEIL": string;
        "ADRESSE_STADTTEILNR": string;
        "ADRESSE_STADTBEZIRK": string;
        "ADRESSE_STADTBEZIRKNR": string;
        "ADRESSE_POSTLEITZAHL": string;
        "ADRESSE_GEMEINDENAME": string;
        "ADRESSE_STADTVIERTELNR": string;
        "ADRESSE_BAUBLOCKNR": string;
        "ADRESSE_BAUBLOCKSEITENR": string;
      }
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