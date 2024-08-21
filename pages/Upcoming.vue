<template>
  <div>
  <LocationPicker/>
  <v-container>

    <v-alert 
      v-if="!hasSetStreet"
      type="info"
    >
      Please select your street name and street number first.
    </v-alert>

  <div v-else>

    <h1>Upcoming Pickups</h1>

    <div v-if="apiUpcoming?.data" class="eventcards">
      <Card
        v-for="event in apiUpcoming?.data?.value?.data"
        :key="`${event.date}_${event.type}_${event.schedule}`"
        :event-data=event
      />
    </div>
    <v-alert 
      v-else
      type="error"
    >
      Uh oh! An Unexpected Error Ocurred!
    </v-alert>

  </div>
</v-container>
</div>
</template>

<script setup lang="ts">

  import type { AwsApiServiceResponseAll } from "~/server/services/AwsApiService.js"
  import { useCookieUserConfig } from "~/composables/useCookieUserConfig";

  const { cookieStreet, cookieLanguage, hasSetStreet } = useCookieUserConfig();
  const streetname = toRef(() => cookieStreet.value.streetname);
  const streetno = toRef(() => cookieStreet.value.streetno);

  //@TODO - fix empty api call, when no streetname/streetno is set
  const apiUpcoming = await useFetch<AwsApiServiceResponseAll>("/api/v1/upcoming", {
    query: {
      streetname: streetname,
      streetno: streetno
    },
  });

</script>

<style>
  .eventcards {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
</style>