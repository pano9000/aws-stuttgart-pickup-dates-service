<template>
  <WarnNoSetStreet/>

  <v-container v-if="props.fetchError">
    <v-alert 
      type="error"
      :title="i18n.t('baseEventDisplay.fetchErrorTitle')"
      :text="i18n.t('baseEventDisplay.fetchErrorText')"
    />
  </v-container>

  <v-container v-if="props.eventData">

    <EventDisplayModeSelector v-model="displayMode"/>

    <EventDisplayDataIterator
      :event-data="props.eventData"
      :is-loading="props.fetchStatus === 'pending'"
      :display-mode="displayMode"
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
  import EventDisplayModeSelector from "./EventDisplayModeSelector.vue";
  import EventDisplayDataIterator from "./EventDisplayDataIterator.vue";
  import type { AwsApiServiceResponseAll } from "~/server/services/AwsApiService.js"
  import type { AsyncDataRequestStatus } from "#app";
  import type { FetchError } from 'ofetch'

  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  const displayMode = ref<"grid"|"calendar"|"list">();

  const props = defineProps<{ 
    eventData: AwsApiServiceResponseAll | null;
    fetchStatus: AsyncDataRequestStatus;
    fetchError: FetchError<unknown> | null;
  }>();
  //const { cookieStreet, hasSetStreet } = useCookieUserConfig();

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


  //workaround due to some hydration mismatch issue in vuetify, when setting the values server side already
  onMounted( () => {
    displayMode.value = "grid"
  })
</script>