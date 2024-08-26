<template>
  <ClientOnly>
    <ScheduleXCalendar :calendar-app="calendarApp" />
  </ClientOnly>
</template>
  

<script setup lang="ts">
import { ScheduleXCalendar } from "@schedule-x/vue"
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar"
import { createEventModalPlugin } from "@schedule-x/event-modal"

import "@schedule-x/theme-default/dist/index.css"
import type { AwsApiServiceResponseAll } from "~/server/services/AwsApiService.js"

const {i18n} = useCustomI18n();
const props = defineProps<{ 
    eventData: AwsApiServiceResponseAll | null;
    isLoading: boolean
  }>();

const eventsComp = computed( () => {
  if (!props.eventData) return [];

  return props.eventData.data.map(event => {
    return {
      id: `${event.type}_${event.date}_${event.schedule}`,
      title: i18n.t(`waste_${event.type}`),
      start: event.date,
      end: event.date,
      location: props.eventData?.information.streetname + " " + props.eventData?.information.streetno
    }
  })

})

// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar({
  selectedDate: (new Date().toISOString()).slice(0,10),
  views: [
    // createViewWeek(),
    createViewMonthGrid(),
    // createViewMonthAgenda(),
  ],
  events: eventsComp.value,
  plugins: [createEventModalPlugin()]

})
</script>