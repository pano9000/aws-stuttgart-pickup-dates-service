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
  const eventDisplayMode = useCookie<"grid" | "list" | "calendar">("eventDisplayMode");

  return {
    cookieStreet,
    cookieLanguage,
    hasSetStreet,
    eventDisplayMode,
    cookieEventDisplayItemsPerPage,
  }
}