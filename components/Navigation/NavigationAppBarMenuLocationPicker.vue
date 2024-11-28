<template>
  <v-dialog id="menu-locationpicker">

    <template #activator="{ props: dialogActivatorProps }">
      <v-btn 
        :prepend-icon="mdiOfficeBuildingMarker"
        :color="(!hasSetStreet) ? 'red' : undefined"
        v-bind="{...dialogActivatorProps}"
      >
        <v-chip
          :text="hasSetStreet ? `${cookieStreet.streetname} ${cookieStreet.streetno}` : i18n.t('locationPickerNavMenuBtn.noAddress')"
          variant="elevated"
        />
      </v-btn>
    </template>

    <template #default="{ isActive }">
      <BaseLocationPicker @location-submitted="isActive.value = false"/>
    </template>

  </v-dialog>
</template>

<script setup lang="ts">
  import BaseLocationPicker from '../LocationPicker/BaseLocationPicker.vue';
  import { mdiOfficeBuildingMarker } from "@mdi/js";
  import { useCustomI18n } from '../../composables/useCustomI18n.js';

  const { hasSetStreet, cookieStreet } = useCookieUserConfig();

  const { i18n, multiMergeLocaleMessage }  = useCustomI18n();

  multiMergeLocaleMessage("locationPickerNavMenuBtn", [
    ["noAddress", {de: "Bitte Adresse Auswählen", en: "Please Select An Address"}],
  ]);


</script>