<template>
  <v-btn-toggle
    v-model="cookieEventDisplayMode"
    color="primary"
    mandatory
    variant="outlined"
  >
    <template v-for="displayMode in displayModes" :key="displayMode[0]">
      <v-tooltip :text="i18n.t(displayMode[2])" location="top">
        <template #activator="{ props }">
          <v-btn
            :icon="displayMode[1]"
            :value="displayMode[0]"
            v-bind="props"
          />
        </template>
      </v-tooltip>
    </template>
  </v-btn-toggle>
</template>

<script setup lang="ts">
  import { mdiViewGridOutline, mdiFormatListBulleted, mdiCalendarMonth } from "@mdi/js";

  const { cookieEventDisplayMode } = useCookieUserConfig();

  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  multiMergeLocaleMessage("eventDisplayModeSelector", [
    ["displayGrid",     {"de": "Als Raster anzeigen",   "en": "Display as Grid"}],
    ["displayList",     {"de": "Als Liste anzeigen",    "en": "Display as List"}],
    ["displayCalendar", {"de": "Als Kalender anzeigen", "en": "Display as Calendar"}],
  ]);

  const displayModes: [value: string, icon: string, tooltip: string][] = [
    ["grid",      mdiViewGridOutline,     "eventDisplayModeSelector.displayGrid"],
    ["list",      mdiFormatListBulleted,  "eventDisplayModeSelector.displayList"],
    ["calendar",  mdiCalendarMonth,       "eventDisplayModeSelector.displayCalendar"]
  ];


</script>