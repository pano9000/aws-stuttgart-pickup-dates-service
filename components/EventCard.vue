<template>

  <v-card
    class="text-center pa-4"
    :color="eventTypeMap.get(props.eventData.type)?.color"
  >
    <v-card-title>
      <v-icon :icon="eventTypeMap.get(props.eventData.type)?.icon" size="3rem"/>
      <h3>{{ props.eventData.type }}</h3>
    </v-card-title>
    <v-card-text>
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