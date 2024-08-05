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

    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
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

  i18n: {
    vueI18n: "./i18n/i18n.config.ts"
  }


})
