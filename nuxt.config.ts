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

  i18n: {
    locales: ["de", "en"],
    defaultLocale: "de",
    detectBrowserLanguage: false,
    vueI18n: "./i18n.config.ts"
  },

  /* @TODO: configure correctly */
  runtimeConfig: {

    public: {
      legalNoticeName1:     process.env.NUXT_PUBLIC_AWSAPPENV_LEGALNOTICE_NAME1,
      legalNoticeName2:     process.env.NUXT_PUBLIC_AWSAPPENV_LEGALNOTICE_NAME2,
      legalNoticeAddress1:  process.env.NUXT_PUBLIC_AWSAPPENV_LEGALNOTICE_ADDRESS1,
      legalNoticeAddress2:  process.env.NUXT_PUBLIC_AWSAPPENV_LEGALNOTICE_ADDRESS2,
      legalNoticeAddress3:  process.env.NUXT_PUBLIC_AWSAPPENV_LEGALNOTICE_ADDRESS3,
      legalNoticeEmail:     process.env.NUXT_PUBLIC_AWSAPPENV_LEGALNOTICE_EMAIL,
      legalNoticePhone:     process.env.NUXT_PUBLIC_AWSAPPENV_LEGALNOTICE_PHONE,
      projectGitUrl:        process.env.NUXT_PUBLIC_AWSAPPENV_PROJECT_GIT_URL,
      copyrightNotice:      process.env.NUXT_PUBLIC_AWSAPPENV_COPYRIGHT_NOTICE,
    }

    /*
    // The private keys which are only available within server-side
    apiSecret: '123',
    awsApiUrl: AWSAPPENV_AWS_API_URL
    AWSAPPENV_AWS_API_STREETNAME_URL
    AWSAPPENV_AWS_API_STREETNO_URL
    AWSAPPENV_REDIS_SERVER_PORT
    AWSAPPENV_REDIS_SERVER_HOST
    AWSAPPENV_REDIS_SERVER_PASSWORD
    AWSAPPENV_FRONTEND_GITHUB_URL
    // Keys within public, will be also exposed to the client-side
    public: {
      apiBase: '/api'
    }
    */
  },

  css: ["@/assets/main.css"],

})
