<template>
  <v-btn-toggle
    v-model="modelDisplayMode"
    color="primary"
    mandatory
  >

    <template 
      v-for="displayMode in displayModes"
      :key="displayMode[0]"
    >
      <v-tooltip :text="displayMode[2]" location="top">
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

  const modelDisplayMode = defineModel<"grid"|"calendar"|"list">("displayMode");

  const displayModes: [value: string, icon: string, tooltip: string][] = [
    ["grid", mdiViewGridOutline, "Display as Grid"],
    ["list", mdiFormatListBulleted, "Display as List"],
    ["calendar", mdiCalendarMonth, "Display as Calendar"]
  ];

</script>