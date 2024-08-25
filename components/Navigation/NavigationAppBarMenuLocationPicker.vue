<template>
  <v-menu
    id="menu-locationpicker"
    width="100vw"
    :close-on-content-click="false"
    open-on-hover
    eager
  >
    <template #activator="{ props }">
      <v-btn 
        :icon="mdiOfficeBuildingMarker"
        v-bind="props"
        :color="(!hasSetStreet) ? 'red' : undefined"
      />
    </template>
    <BaseLocationPicker/>
  </v-menu>
</template>

<script setup lang="ts">
  import BaseLocationPicker from '../LocationPicker/BaseLocationPicker.vue';
  import { mdiOfficeBuildingMarker } from "@mdi/js";
  const { hasSetStreet } = useCookieUserConfig();

</script>