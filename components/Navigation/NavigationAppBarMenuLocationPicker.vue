<template>
  <v-menu
    id="menu-locationpicker"
    width="100vw"
    :close-on-content-click="false"
    open-on-hover
    eager
  >
    <template #activator="{ props }">
      <div v-bind="props">
        <v-btn 
        :prepend-icon="mdiOfficeBuildingMarker"
        :color="(!hasSetStreet) ? 'red' : undefined"
        >
        <v-chip
          :text="hasSetStreet ? `${cookieStreet.streetname} ${cookieStreet.streetno}` : i18n.t('locationPickerNavMenuBtn.noAddress')"
          variant="elevated"
        />
        </v-btn>
      </div>
    </template>
    <BaseLocationPicker/>
  </v-menu>
</template>

<script setup lang="ts">
  import BaseLocationPicker from '../LocationPicker/BaseLocationPicker.vue';
  import { mdiOfficeBuildingMarker } from "@mdi/js";
  import { useCustomI18n } from '../../composables/useCustomI18n.js';

  const { hasSetStreet, cookieStreet } = useCookieUserConfig();

  const { i18n, multiMergeLocaleMessage }  = useCustomI18n();

  multiMergeLocaleMessage("locationPickerNavMenuBtn", [
    ["noAddress", {de: "Bitte Adresse Auswählen", en: "Please Select Address"}],
  ]);


</script>