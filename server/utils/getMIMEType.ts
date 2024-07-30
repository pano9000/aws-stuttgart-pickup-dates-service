import type { RetrieveDataFacadeFormat } from "../services/RetrieveDataFacade"

const MIMETypes = new Map<RetrieveDataFacadeFormat, string>([
  ["json", "application/json"],
  ["ical", "text/calendar"],
  ["csv", "text/csv"]
])

export default function(type: RetrieveDataFacadeFormat): string {

  return MIMETypes.get(type) || "application/json"

}