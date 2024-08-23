<template>
  <!-- :class="['eventcard', `eventcard_${props.eventData.type}`]" -->

  <v-card
    class="text-center"
    :color="eventTypeMap.get(props.eventData.type)?.color"
  >
    <v-card-title>
      <h3>{{ props.eventData.type }}</h3>
    </v-card-title>
    <v-card-text>
      <v-icon :icon="eventTypeMap.get(props.eventData.type)?.icon" size="3rem"/>
      <div>{{ props.eventData.date }}</div>
      <div>{{ props.eventData.schedule }}</div>
    </v-card-text>

  </v-card>

</template>

<script setup lang="ts">
  import type { AwsApiServiceEventTypeName, AwsApiServiceEventScheduleName } from "~/server/services/AwsApiService";
  import eventTypeMap from "~/utils/eventTypeMap"

  const props = defineProps<{ 
    eventData: { 
      type: AwsApiServiceEventTypeName,
      date: string,
      schedule: AwsApiServiceEventScheduleName
    }
  }>();

</script>

<style>

</style>