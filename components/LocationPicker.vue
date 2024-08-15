<template>
<div class="pa-4 bg-orange">
  <v-form 
    ref="form"
    class="d-flex align-baseline ga-4"
    :readonly="!isLocationPickerActive"
    @submit.prevent="() => storeStreetInCookieHandler(streetname, streetno, form)"
  >
    <v-row
      align="center"
    >
      <v-col cols="5">
        <LocationPickerComboBox
          v-model:input-combo-box="streetname"
          v-model:streetname="streetname"
          v-model:streetno="streetno"
          :is-enabled="isLocationPickerActive"
          mode="streetname"
          no-data-text="Street Name"
          icon="mdi-home-city"
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
          icon="mdi-numeric"
          label="Street Number"
        />
      </v-col>

      <v-col cols="auto">
        <v-btn
          v-if="isLocationPickerActive"
          :disabled="!form?.isValid"
          type="submit"
          class="text-capitalize"
        >
          Save
        </v-btn>

        <v-btn
          v-else 
          type="button"
          class="text-capitalize"
          @click="isLocationPickerActive = !isLocationPickerActive"
        >
          Change
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</div>
</template>

<script setup lang="ts">
import { VForm } from 'vuetify/components';
import { useCookieUserConfig } from '~/composables/useCookieUserConfig';

const { cookieStreet } = useCookieUserConfig();

const streetname = ref(cookieStreet.value.streetname);
const streetno = ref(cookieStreet.value.streetno);
const isLocationPickerActive = ref(false);
const form = ref<VForm>();

function storeStreetInCookieHandler(streetname: string, streetno: string, form: VForm ) {
  if (form.isValid) {
    cookieStreet.value.streetname = streetname;
    cookieStreet.value.streetno = streetno;
    isLocationPickerActive.value = false
  }
}
</script>

<style>


</style>