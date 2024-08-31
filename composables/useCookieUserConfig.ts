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

  const hasSetStreet = computed<boolean>( () => !!cookieStreet.value.streetname && !!cookieStreet.value.streetno);
  
  const cookieLanguage = useCookie<string>("lang", { 
    default: () => "de"
  });

  const cookieEventDisplayItemsPerPage = useCookie<number>("eventDisplayItemsPerPage", {
    default: () => 6
  });

  const cookieEventDisplayMode = useCookie<"grid" | "list" | "calendar">("eventDisplayMode", {
    default: () => "grid"
  });

  const cookieEventTypeSelector = useCookie<AwsApiServiceEventTypeName[]>("eventTypeSelector", {
    default: () => ["residual", "organic", "recycle", "paper"]
  });

  return {
    cookieStreet,
    cookieLanguage,
    hasSetStreet,
    cookieEventDisplayMode,
    cookieEventDisplayItemsPerPage,
    cookieEventTypeSelector,
  }
}