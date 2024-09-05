<template>
  <v-card 
    class="pa-8"
  >
    <v-card-title>
      {{ i18n.t('baseLocationPicker.title') }}
    </v-card-title>
    <v-form 
      ref="form"
      class="d-flex align-baseline ga-4"
      :disabled="!isLocationPickerActive && hasSetStreet"
      @submit.prevent="storeStreetInCookieHandler"
    >
      <v-row align="center">
        <v-col cols="5">
          <LocationPickerComboBox
            v-model:input-combo-box="streetname"
            v-model:streetname="streetname"
            v-model:streetno="streetno"
            :is-enabled="isLocationPickerActive"
            mode="streetname"
            :icon="mdiHomeCity"
            :label="i18n.t('baseLocationPicker.labelStreetName')"
          />
        </v-col>

        <v-col cols="5">
          <LocationPickerComboBox
            v-model:input-combo-box="streetno"
            v-model:streetname="streetname"
            v-model:streetno="streetno"
            :is-enabled="isLocationPickerActive"
            mode="streetno"
            :icon="mdiNumeric"
            :label="i18n.t('baseLocationPicker.labelStreetNo')"
          />
        </v-col>

        <v-col cols="auto">
          <v-tooltip
            :text="(isLocationPickerActive || !hasSetStreet) ? i18n.t('baseLocationPicker.btnSave') : i18n.t('baseLocationPicker.btnEdit')"
            location="top"
          >
            <template #activator="{ props }">
              <v-btn
                v-if="isLocationPickerActive || !hasSetStreet"
                :disabled="!form?.isValid"
                type="submit"
                :icon="mdiCheckBold"
                v-bind="props"
              />

              <v-btn
                v-else 
                type="button"
                :icon="mdiPencil"
                v-bind="props" 
                @click="isLocationPickerActive = !isLocationPickerActive"
              />
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { VForm } from 'vuetify/components';
import { useCookieUserConfig } from '~/composables/useCookieUserConfig';
import { mdiHomeCity, mdiNumeric, mdiCheckBold, mdiPencil } from "@mdi/js";

const { cookieStreet, hasSetStreet } = useCookieUserConfig();
const { i18n, multiMergeLocaleMessage } = useCustomI18n();

const streetname = ref(cookieStreet.value.streetname);
const streetno = ref(cookieStreet.value.streetno);
const isLocationPickerActive = ref(false);
const form = ref<InstanceType<typeof VForm>|null>();

multiMergeLocaleMessage("baseLocationPicker", [
  ["title", {de: "Adresse Auswählen", en: "Select Address"}],
  ["labelStreetName", {de: "Straßenname", en: "Street Name"}],
  ["labelStreetNo", {de: "Hausnummer", en: "Street Number"}],
  ["btnEdit", {de: "Bearbeiten", en: "Edit"}],
  ["btnSave", {de: "Speichern", en: "Save"}],
])

function storeStreetInCookieHandler() {
  if (form?.value?.isValid) {
    cookieStreet.value.streetname = streetname.value;
    cookieStreet.value.streetno = streetno.value;
    isLocationPickerActive.value = false
  }
}
</script>

<style>


</style>