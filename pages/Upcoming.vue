<template>
  <v-container>
    <h1>{{ i18n.t("upcoming.pageTitle") }}</h1>
    <p v-show="hasSetStreet">{{ i18n.t("upcoming.pageSubtitle", { address: `${cookieStreet.streetname} ${cookieStreet.streetno}` }) }}</p>

    <BaseEventDisplay api-endpoint="/api/v1/upcoming"/>
</v-container>
</template>

<script setup lang="ts">
  import BaseEventDisplay from "~/components/EventDisplay/BaseEventDisplay.vue";
  import { useCookieUserConfig } from "~/composables/useCookieUserConfig";

  const { cookieStreet, hasSetStreet } = useCookieUserConfig();

  const { i18n, multiMergeLocaleMessage }  = useCustomI18n();
  multiMergeLocaleMessage("upcoming", [
    ["pageTitle", {de: "Bevorstehende Abholungen", en: "Upcoming Pickups"}],
    ["pageSubtitle", {de: "Die bevorstehende Abholungen für { address }", en: "The next upcoming pickups for { address }"}],
  ]);

</script>