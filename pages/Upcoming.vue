<template>
  <v-container>
    <h1>{{ i18n.t("upcoming.pageTitle") }}</h1>
    <p>{{ i18n.t("upcoming.pageSubtitle", { address: `${streetname} ${streetno}` }) }}</p>

    <BaseEventDisplay
      :event-data="apiData"
      :fetch-status="apiStatus"
      :fetch-error="apiError"
    />
</v-container>
</template>

<script setup lang="ts">

  import type { AwsApiServiceResponseAll } from "~/server/services/AwsApiService.js"
  import { useCookieUserConfig } from "~/composables/useCookieUserConfig";
import BaseEventDisplay from "~/components/EventDisplay/BaseEventDisplay.vue";

  const { cookieStreet } = useCookieUserConfig();

  const { i18n, multiMergeLocaleMessage }  = useCustomI18n();
  multiMergeLocaleMessage("upcoming", [
    ["pageTitle", {de: "Bevorstehende Abholungen", en: "Upcoming Pickups"}],
    ["pageSubtitle", {de: "Die bevorstehende Abholungen für { address }", en: "The next upcoming pickups for { address }"}],
  ]);

  const streetname = toRef(() => cookieStreet.value.streetname);
  const streetno = toRef(() => cookieStreet.value.streetno);

  //@TODO https://nuxt.com/docs/guide/recipes/custom-usefetch#custom-usefetch
  //@TODO - fix empty api call, when no streetname/streetno is set
  const { data: apiData, status: apiStatus, error: apiError } = await useFetch<AwsApiServiceResponseAll>("/api/v1/upcoming", {
    query: {
      streetname: streetname,
      streetno: streetno
    },
  });


</script>