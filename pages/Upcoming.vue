<template>

  <LocationPicker></LocationPicker>
  has Street: {{ hasStreet }} // {{ cookieStreet }}
  language: {{ cookieLanguage }}
  fetchCount: {{ fetchCount }}
  <div v-if="!hasStreet">
    Please select your street and street no first.
  </div>

  <div v-else>

    <h1>Upcoming Pickups</h1>
    <details>
      {{ apiData }}
    </details>

    <div v-if="apiData?.data" class="eventcards">
      <Card
        v-for="event in apiData?.data"
        :event-data=event>
      </Card>
    </div>
    <div v-else>

      Uh oh! An Unexpected Error Ocurred!

    </div>

  </div>

</template>

<script setup lang="ts">

  import type { AwsApiServiceResponseAll } from "~/server/services/AwsApiService.js"
  import { useCookieUserConfig } from "~/components/useCookieUserConfig";

  const { cookieStreet, cookieLanguage } = useCookieUserConfig();
  const streetname = toRef(() => cookieStreet.value.streetname);
  const streetno = toRef(() => cookieStreet.value.streetno);
  const hasStreet = computed( () => !!cookieStreet.value.streetname && !!cookieStreet.value.streetno);

  const fetchCount = ref(0);

  const apiData = ref<AwsApiServiceResponseAll|null>(null)

  const apiUpcoming = await useFetch<AwsApiServiceResponseAll>("/api/v1/upcoming", {
    query: {
      streetname: streetname,
      streetno: streetno
    },
    onRequest: (e) => {
      console.log(e); fetchCount.value++
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