import type { AwsApiServiceEventTypeName } from "~/server/services/AwsApiService";
import type { RetrieveDataFacadeFormat } from "~/server/services/RetrieveDataFacade";


export default function getApiUrl(options: {
  endpointName: string,
  streetname: string,
  streetno: string,
  eventTypes: AwsApiServiceEventTypeName[],
  format: RetrieveDataFacadeFormat,
  language: string
}) {
  const apiUrl = new URL(options.endpointName, "http://localhost:3000"); //@TODO use runtimeconfig

  const apiUrlParams = new URLSearchParams([
    ["streetname", options.streetname],
    ["streetno", options.streetno],
    ["type", options.eventTypes.join(",")],
    ["format", options.format],
    ["translated", options.language]
  ]);

  apiUrl.search = apiUrlParams.toString();

  return apiUrl.toString()
}