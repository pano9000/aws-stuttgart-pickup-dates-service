<template>
  <v-container>
    <h1>All Pickups</h1>
    <p>All of the pickups for {{ `${streetname} ${streetno}` }}</p>

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
  const streetname = toRef(() => cookieStreet.value.streetname);
  const streetno = toRef(() => cookieStreet.value.streetno);

  //@TODO https://nuxt.com/docs/guide/recipes/custom-usefetch#custom-usefetch
  //@TODO - fix empty api call, when no streetname/streetno is set
  const { data: apiData, status: apiStatus, error: apiError } = await useFetch<AwsApiServiceResponseAll>("/api/v1/all", {
    query: {
      streetname: streetname,
      streetno: streetno
    },
  });


</script>