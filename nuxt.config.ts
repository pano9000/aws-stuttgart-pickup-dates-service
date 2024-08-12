// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },

  modules: [

    "@nuxt/test-utils/module",

    "@nuxtjs/i18n",

    "@nuxt/eslint",

    "@vueuse/nuxt",

    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error - as per vuetify docs
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls: transformAssetUrls,
      },
    },
  },

  typescript: {
    typeCheck: true
  },


/*
  i18n: {
    vueI18n: "./plugins/i18n.config.ts"
  }
*/

})
