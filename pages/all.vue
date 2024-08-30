<template>
  <v-container>
    <h1>{{ i18n.t("all.pageTitle") }}</h1>
    <p>{{ i18n.t("all.pageSubtitle", { address: `${cookieStreet.streetname} ${cookieStreet.streetno}` }) }}</p>

    <BaseEventDisplay api-endpoint="/api/v1/all"/>
  </v-container>
</template>

<script setup lang="ts">
  import BaseEventDisplay from "~/components/EventDisplay/BaseEventDisplay.vue";
  import { useCookieUserConfig } from "~/composables/useCookieUserConfig";

  const { cookieStreet } = useCookieUserConfig();
  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  multiMergeLocaleMessage("all", [
    ["pageTitle", {de: "Alle Abholungen", en: "All Pickups"}],
    ["pageSubtitle", {de: "Alle geplanten Abholungen für { address }", en: "All scheduled pickups for { address }"}],
  ]);

</script>