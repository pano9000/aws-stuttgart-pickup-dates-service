export function userCookieUserConfig() {


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

  return {
    cookieStreet: cookieStreet,
    cookieLanguage: cookieLanguage
  }
}