<template>

<div class="pa-4 bg-orange">

  <v-form 
    @submit.prevent="() => storeStreetInCookie(streetname, streetno)" 
    :disabled="!locationPickerActive"
    class="d-flex align-baseline ga-4"
  >
    <span class="font-weight-bold">Current Address:</span>

    <v-text-field 
      v-model="streetname"
      label="Street Name"
      clearable
      prepend-icon="mdi-home-city"
    >
    </v-text-field>

    <v-text-field 
      v-model="streetno"
      label="Street Number"
      clearable
      prepend-icon="mdi-numeric"
    >
    </v-text-field>

    <v-btn v-if="locationPickerActive"
      type="submit"
      class="text-capitalize"
    >
      Save
    </v-btn>
    <v-btn v-else 
      type="button"
      @click="locationPickerActive = !locationPickerActive"
      class="text-capitalize"
    >
      Change
    </v-btn>

  </v-form>

</div>

</template>

<script setup lang="ts">
import { userCookieUserConfig } from './useCookieUserConfig';


const { cookieStreet } = userCookieUserConfig();
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