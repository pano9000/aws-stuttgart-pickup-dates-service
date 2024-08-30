<template>
  <WarnNoSetStreet/>

  <v-container v-if="fetchError">
    <v-alert 
      type="error"
      :title="i18n.t('baseEventDisplay.fetchErrorTitle')"
      :text="i18n.t('baseEventDisplay.fetchErrorText')"
    />
  </v-container>

  <v-container v-if="eventData">

    <EventDisplayDataIterator
      :event-data="eventData"
      :is-loading="fetchStatus === 'pending'"
      />

  </v-container>

  <v-container v-else>
    <v-alert 
      type="info"
      :title="i18n.t('baseEventDisplay.fetchNoDataTitle')"
      :text="i18n.t('baseEventDisplay.fetchNoDataText')"
    />
  </v-container>

</template>

<script setup lang="ts">
  import WarnNoSetStreet from "../WarnNoSetStreet.vue";
  import EventDisplayDataIterator from "./EventDisplayDataIterator.vue";
  import type { AwsApiServiceResponseAll } from "~/server/services/AwsApiService.js"

  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  const props = defineProps<{
    apiEndpoint: string;
  }>();

  const { cookieStreet } = useCookieUserConfig();

  const streetname = toRef(() => cookieStreet.value.streetname);
  const streetno = toRef(() => cookieStreet.value.streetno);

  //@TODO https://nuxt.com/docs/guide/recipes/custom-usefetch#custom-usefetch
  //@TODO - fix empty api call, when no streetname/streetno is set
  const { data: eventData, status: fetchStatus, error: fetchError } = await useFetch<AwsApiServiceResponseAll>(props.apiEndpoint, {
    query: {
      streetname: streetname,
      streetno: streetno
    },
  });





  multiMergeLocaleMessage("baseEventDisplay", [
    [
      "fetchErrorTitle", {"de": "Ups! Ein unerwarteter Fehler ist aufgetreten.", "en": "Uh oh! An Unexpected Error Ocurred."}
    ],
    [
      "fetchErrorText", {
        "de": "Bitte prüfen Sie Ihre ausgewählte Addresse und probieren es später erneut oder bitte melden Sie das Problem.", 
        "en": "Please check your selected address and try again later or kindly report the issue."
      }
    ],
    [
      "fetchNoDataTitle", {"de": "Es gibt nichts zu sehen", "en": "Nothing to see here"}
    ],
    [
      "fetchNoDataText", {
        "de": "Es sieht so aus, als wenn es keine Daten zum Anzeigen gibt.",
        "en": "It looks like there is no data to display."
      }
    ],
  ]);
</script>