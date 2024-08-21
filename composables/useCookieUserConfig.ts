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

  return {
    cookieStreet: cookieStreet,
    cookieLanguage: cookieLanguage,
    hasSetStreet: hasSetStreet
  }
}