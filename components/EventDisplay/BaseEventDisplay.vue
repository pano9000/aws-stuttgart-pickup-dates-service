<template>
  <WarnNoSetStreet/>
  <v-container v-if="props.eventData">

    <EventDisplayModeSelector v-model="displayMode"/>

    <EventDisplayGrid
      v-if="displayMode === 'grid'"
      :event-data="props.eventData"
    />

    <EventDisplayList
      v-else-if="displayMode === 'list'"
      :event-data="props.eventData"
    />

    <EventDisplayCalendar
      v-else-if="displayMode === 'calendar'"
      :event-data="props.eventData"
    />

  </v-container>
  <v-container v-else>
    <v-alert 
      type="error"
      title="Uh oh! An Unexpected Error Ocurred."
      text="Please check your address and try again later or kindly report the issue."
    />
  </v-container>

</template>

<script setup lang="ts">
  import type { AwsApiServiceResponseAll } from "~/server/services/AwsApiService.js"
  import WarnNoSetStreet from "../WarnNoSetStreet.vue";
  import EventDisplayModeSelector from "./EventDisplayModeSelector.vue";
  import EventDisplayGrid from "./EventDisplayGrid.vue";
  import EventDisplayCalendar from "./EventDisplayCalendar.vue";
  import type { AsyncDataRequestStatus } from "#app";
  import type { FetchError } from 'ofetch'
  const displayMode = ref<"grid"|"calendar"|"list">();

  const props = defineProps<{ 
    eventData: AwsApiServiceResponseAll | null;
    fetchStatus: AsyncDataRequestStatus;
    fetchError: FetchError<unknown> | null;
  }>();
  //const { cookieStreet, hasSetStreet } = useCookieUserConfig();

  //workaround due to some hydration mismatch issue in vuetify, when setting the values server side already
  onMounted( () => {
    displayMode.value = "grid"
  })
</script>