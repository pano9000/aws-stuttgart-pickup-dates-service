//@TODO check how to make this work with @nuxtjs/i18n
const i18nConfig = {
  legacy: false,
  locale: "de",
  messages: {
    en: {
      waste_paper: "Waste Paper",
      waste_residual: "Residual Waste",
      waste_recycle: "Recycleable Waste",
      waste_organic: "Organic Waste",
      schedule_W1: "weekly",
      schedule_W2: "bi-weekly",
      schedule_W3: "tri-weekly",
      term_pickup: "Pickup",
      term_pickups: "Abholungen",
      csv_header: "Date,Type,Schedule,Irregular Schedule,Streetname,Streetno\r\n"
    },
    de: {
      waste_paper: "Altpapier",
      waste_residual: "Restmüll",
      waste_recycle: "Gelber Sack",
      waste_organic: "Biomüll",
      schedule_W1: "wöchentlich",
      schedule_W2: "2-wöchentlich",
      schedule_W3: "3-wöchentlich",
      term_pickup: "Abholung",
      term_pickups: "Abholungen",
      csv_header: "Datum,Art,Turnus,Außerplanmäßiger Turnus,Straßenname,Straßennr\r\n"
    }
  }
}

export default i18nConfig
