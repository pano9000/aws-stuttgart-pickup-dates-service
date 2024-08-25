import { createVuetify } from "vuetify"
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import "vuetify/styles"

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: { mdi }
    },
    defaults: {
      global: {
        ripple: false,
      }
    },
    ssr: true
  });
  app.vueApp.use(vuetify)
})
