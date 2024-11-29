import { defineVitestConfig } from "@nuxt/test-utils/config"
import { config } from "dotenv";


export default defineVitestConfig({
  test: {
    // coverage: {
    //   provider: "v8"
    // },
    env: {
      ...config({ path: "./.env-nuxt.DEV" }).parsed,
    }
  }
})
