<template>

<div class="pa-4 bg-orange">

  <v-form 
    class="d-flex align-baseline ga-4"
    :disabled="!locationPickerActive"
    @submit.prevent="() => storeStreetInCookie(streetname, streetno)" 
  >
    <span class="font-weight-bold">Current Address:</span>

    <!-- <v-text-field 
      v-model="streetname"
      label="Street Name"
      clearable
      prepend-icon="mdi-home-city"
    />

    <v-text-field 
      v-model="streetno"
      label="Street Number"
      clearable
      prepend-icon="mdi-numeric"
    />
    
    -->

    <v-combobox
      v-model="streetname"
      label="Street Name "
      :items="streetnameSuggestions"
      prepend-icon="mdi-home-city"
      clearable
    />

    <v-combobox
      v-model="streetno"
      label="Street Number"
      :items="streetnoSuggestions"
      prepend-icon="mdi-numeric"
      clearable
    />



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

  </v-form>

</div>

</template>

<script setup lang="ts">
import { useCookieUserConfig } from '~/composables/useCookieUserConfig';
import { watchDebounced } from '@vueuse/core'

const { cookieStreet } = useCookieUserConfig();
const streetname = ref(cookieStreet.value.streetname);
const streetno = ref(cookieStreet.value.streetno);
const locationPickerActive = ref(false);

const streetnameSuggestions = ref<string[]>([]);
const streetnoSuggestions = ref<string[]>([]);

//@TODO: how to get cookieStreet as argument? it fails due to type, beacuse in template it is "unpacked"
function storeStreetInCookie(streetname: string, streetno: string) {
  cookieStreet.value.streetname = streetname;
  cookieStreet.value.streetno = streetno;
  locationPickerActive.value = false
}

watchDebounced(
  streetname, 
  async (newStreetname, _oldStreetname) => {
    streetno.value = ""
    if (!newStreetname || newStreetname.length < 1) {
      streetnameSuggestions.value = []
      return;
    }
    const response = await $fetch("/api/v1/addresssuggestion", {
      query: {
        streetname: newStreetname
      }
    })
    console.log(response);
  streetnameSuggestions.value = response || []
  },
  { debounce: 1000, maxWait: 2000 },
)

watchDebounced(
  streetno, 
  async (newStreetno, _oldStreetno) => {
    if (!newStreetno || newStreetno.length < 1) {
      streetnoSuggestions.value = []
      return;
    }
    const response = await $fetch("/api/v1/addresssuggestion", {
      query: {
        streetname: streetname.value,
        streetno: newStreetno
      }
    })
    console.log(response);
    streetnoSuggestions.value = response || []

  },
  { debounce: 500, maxWait: 1000 },
)

</script>

<style>


</style>