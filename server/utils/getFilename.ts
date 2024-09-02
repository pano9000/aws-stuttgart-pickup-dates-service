import type { RetrieveDataFacadeFormat } from "~/server/services/RetrieveDataFacade";

const illegalCharRegEx: RegExp = /[*?|\\/":><.]/g;

export default function getFilename(streetname: string, streetno: string, formatExtension: RetrieveDataFacadeFormat) {
  return `${streetname} ${streetno}`.replaceAll(illegalCharRegEx, '') + `.${formatExtension}`;
}