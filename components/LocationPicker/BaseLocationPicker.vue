<template>
  <v-card class="pa-8">

    <v-card-title class="text-center">
      {{ i18n.t('baseLocationPicker.title') }}
    </v-card-title>

    <v-form
      ref="form"
      class="align-baseline ga-4"
      :disabled="!isLocationPickerActive && hasSetStreet"
      @submit.prevent="storeStreetInCookieHandler"
    >

      <LocationPickerComboBox
        v-model:input-combo-box="streetname"
        v-model:streetname="streetname"
        v-model:streetno="streetno"
        :is-enabled="isLocationPickerActive"
        mode="streetname"
        :icon="mdiHomeCity"
        :label="i18n.t('baseLocationPicker.labelStreetName')"
      />

      <LocationPickerComboBox
        v-model:input-combo-box="streetno"
        v-model:streetname="streetname"
        v-model:streetno="streetno"
        :is-enabled="isLocationPickerActive"
        mode="streetno"
        :icon="mdiNumeric"
        :label="i18n.t('baseLocationPicker.labelStreetNo')"
      />

      <v-card-actions>

        <v-btn
          v-if="isLocationPickerActive || !hasSetStreet"
          type="submit"
          :disabled="!form?.isValid"
          block
          border
          :text="i18n.t('baseLocationPicker.btnSave')"
        />

        <v-btn
          v-else
          type="button"
          block
          border
          :text="i18n.t('baseLocationPicker.btnChange')"
          @click="changeAddressHandler"
        />

      </v-card-actions>

    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { VForm } from 'vuetify/components';
import { useCookieUserConfig } from '~/composables/useCookieUserConfig';
import { mdiHomeCity, mdiNumeric } from "@mdi/js";

const { cookieStreet, hasSetStreet } = useCookieUserConfig();
const { i18n, multiMergeLocaleMessage } = useCustomI18n();

const streetname = ref(cookieStreet.value.streetname);
const streetno = ref(cookieStreet.value.streetno);
const isLocationPickerActive = ref(false);
const form = ref<InstanceType<typeof VForm>|null>();

const emits = defineEmits(["locationSubmitted"]);

function storeStreetInCookieHandler() {
  if (form?.value?.isValid) {
    cookieStreet.value.streetname = streetname.value;
    cookieStreet.value.streetno = streetno.value;
    isLocationPickerActive.value = false;
    emits('locationSubmitted')
  }
}

function changeAddressHandler() {
  streetname.value = '';
  streetno.value = '';
  isLocationPickerActive.value = true;
}

multiMergeLocaleMessage("baseLocationPicker", [
  ["title", {de: "Adresse Auswählen", en: "Select Address"}],
  ["labelStreetName", {de: "Straßenname", en: "Street Name"}],
  ["labelStreetNo", {de: "Hausnummer", en: "Street Number"}],
  ["btnSave", {de: "Speichern", en: "Save"}],
  ["btnChange", {de: "Ändern", en: "Change"}],
]);

</script>

<style>


</style>