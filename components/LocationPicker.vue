<template>
<div class="pa-4 bg-orange">
  <v-form 
    class="d-flex align-baseline ga-4"
    :readonly="!locationPickerActive"
    @submit.prevent="() => storeStreetInCookie(streetname, streetno)" 
  >
    <v-row
      align="center"
    >
      <v-col cols="5">
        <LocationPickerComboBox
          v-model:input-combo-box="streetname"
          v-model:streetname="streetname"
          v-model:streetno="streetno"
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
          mode="streetno"
          no-data-text="Street Number"
          icon="mdi-numeric"
          label="Street Number"
        />
      </v-col>

      <v-col cols="auto">
        <v-btn
          v-if="locationPickerActive"
          type="submit"
          class="text-capitalize"
        >
          Save
        </v-btn>

        <v-btn
          v-else 
          type="button"
          class="text-capitalize"
          @click="locationPickerActive = !locationPickerActive"
        >
          Change
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</div>
</template>

<script setup lang="ts">
import { useCookieUserConfig } from '~/composables/useCookieUserConfig';

const { cookieStreet } = useCookieUserConfig();
const streetname = ref(cookieStreet.value.streetname);
const streetno = ref(cookieStreet.value.streetno);
const locationPickerActive = ref(false);

//@TODO: how to get cookieStreet as argument? it fails due to type, beacuse in template it is "unpacked"
function storeStreetInCookie(streetname: string, streetno: string) {
  cookieStreet.value.streetname = streetname;
  cookieStreet.value.streetno = streetno;
  locationPickerActive.value = false
}
</script>

<style>


</style>