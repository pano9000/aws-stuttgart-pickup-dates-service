import type { CookieOptions } from "#app";
import type { AwsApiServiceEventTypeName } from "~/server/services/AwsApiService";

function setDefaultCookieSettings<T>(value: T): CookieOptions<T> & { readonly?: false} {
  return {
    default: () => {
      return value
    },
    maxAge: 60*60*24*365, // 1 year,
    sameSite: "strict",
  }
}

export function useCookieUserConfig() {

  //@TODO can we get rid of the default here?
  const cookieStreet = useCookie("street", setDefaultCookieSettings<{streetname: string, streetno: string}>({
    streetname: "",
    streetno: ""
  }));

  const hasSetStreet = computed<boolean>( () => !!cookieStreet.value.streetname && !!cookieStreet.value.streetno);

  const cookieLanguage = useCookie("lang", setDefaultCookieSettings<string>("de"));

  const cookieEventDisplayItemsPerPage = useCookie("eventDisplayItemsPerPage", 
    setDefaultCookieSettings<number>(6)
  );

  const cookieEventDisplayMode = useCookie("eventDisplayMode",
    setDefaultCookieSettings<"grid" | "list" | "calendar">("grid")
  );

  const cookieEventTypeSelector = useCookie("eventTypeSelector", 
    setDefaultCookieSettings<AwsApiServiceEventTypeName[]>(["residual", "organic", "recycle", "paper"])
  );

  return {
    cookieStreet,
    cookieLanguage,
    hasSetStreet,
    cookieEventDisplayMode,
    cookieEventDisplayItemsPerPage,
    cookieEventTypeSelector,
  }
}