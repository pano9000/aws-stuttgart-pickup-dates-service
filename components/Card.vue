<template>
  <!-- :class="['eventcard', `eventcard_${props.eventData.type}`]" -->

  <v-card
    class="text-center"
    :color="cardColor.get(props.eventData.type)"
  >
    <v-card-title>
      <h3>{{ props.eventData.type }}</h3>
    </v-card-title>
    <v-card-text>
      <CardIcon :event-type="props.eventData.type" :size="48" />
      <div>{{ props.eventData.date }}</div>
      <div>{{ props.eventData.schedule }}</div>
    </v-card-text>

  </v-card>

</template>

<script setup lang="ts">
  import type { AwsApiServiceEventTypeName, AwsApiServiceEventScheduleName } from "~/server/services/AwsApiService";

  const props = defineProps<{ 
    eventData: { 
      type: AwsApiServiceEventTypeName,
      date: string,
      schedule: AwsApiServiceEventScheduleName
    }
  }>();

  const cardColor = new Map<AwsApiServiceEventTypeName, string>([
    ["residual", "grey-darken-4"],
    ["organic", "brown"],
    ["recycle", "yellow-accent-2"],
    ["paper", "green-accent-4"]
  ])

</script>

<style>

</style>