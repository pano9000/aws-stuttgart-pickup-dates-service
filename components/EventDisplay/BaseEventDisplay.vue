<template>
  <v-container v-if="fetchError">
    <v-alert 
      type="error"
      :title="i18n.t('baseEventDisplay.fetchErrorTitle')"
      :text="i18n.t('baseEventDisplay.fetchErrorText')"
    />
  </v-container>

  <v-container v-else>
    <EventDisplayDataIterator
      :event-data="eventData"
      :is-loading="fetchStatus === 'pending'"
      :api-endpoint="props.apiEndpoint"
    />
  </v-container>
</template>

<script setup lang="ts">
  import EventDisplayDataIterator from "./EventDisplayDataIterator.vue";
  import type { AwsApiServiceResponseAll } from "~/server/services/AwsApiService.js"

  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  const props = defineProps<{
    apiEndpoint: string;
  }>();

  const { cookieStreet, hasSetStreet } = useCookieUserConfig();

  const streetname = toRef(() => cookieStreet.value.streetname);
  const streetno = toRef(() => cookieStreet.value.streetno);

  const {
    data: eventData,
    status: fetchStatus,
    error: fetchError,
    execute: fetchExecute
  } = await useFetch<AwsApiServiceResponseAll>(props.apiEndpoint, {
    query: { streetname, streetno },
    immediate: false,
  });

  if (hasSetStreet.value) await fetchExecute();

  watch(hasSetStreet, async (curr, _old) => {
    if (curr) await fetchExecute();
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
  ]);
</script>