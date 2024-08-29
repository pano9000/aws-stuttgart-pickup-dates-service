import type { AwsApiServiceEventTypeName } from "~/server/services/AwsApiService";

export function useCookieUserConfig() {

  //@TODO can we get rid of the default here?
  const cookieStreet = useCookie<{streetname: string, streetno: string}>("street", {
    default: () => {
      return {
        streetname: "",
        streetno: ""
      }
    }
  });

  const cookieLanguage = useCookie<string>("lang");
  const hasSetStreet = computed<boolean>( () => !!cookieStreet.value.streetname && !!cookieStreet.value.streetno);
  
  const cookieEventDisplayItemsPerPage = useCookie<number>("eventDisplayItemsPerPage");
  const cookieEventDisplayMode = useCookie<"grid" | "list" | "calendar">("eventDisplayMode");
  const cookieEventTypeSelector = useCookie<AwsApiServiceEventTypeName[]>("eventTypeSelector");

  return {
    cookieStreet,
    cookieLanguage,
    hasSetStreet,
    cookieEventDisplayMode,
    cookieEventDisplayItemsPerPage,
    cookieEventTypeSelector,
  }
}