<template>
  <v-card 
    class="pa-8"
  >
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
            no-data-text="Street Name"
            :icon="mdiHomeCity"
            label="Street Name"
          />
        </v-col>

        <v-col cols="5">
          <LocationPickerComboBox
            v-model:input-combo-box="streetno"
            v-model:streetname="streetname"
            v-model:streetno="streetno"
            :is-enabled="isLocationPickerActive"
            mode="streetno"
            no-data-text="Street Number"
            :icon="mdiNumeric"
            label="Street Number"
          />
        </v-col>

        <v-col cols="auto">
          <v-tooltip
            :text="(isLocationPickerActive || !hasSetStreet) ? `Save` : `Edit`"
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

const streetname = ref(cookieStreet.value.streetname);
const streetno = ref(cookieStreet.value.streetno);
const isLocationPickerActive = ref(false);
const form = ref<InstanceType<typeof VForm>|null>();



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