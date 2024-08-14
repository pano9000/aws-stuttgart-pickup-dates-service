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
          :items="streetnameSuggestions"
          :loading="streetnameSuggestionsLoading"
          :no-data-text="noDataComboText"
          icon="mdi-home-city"
          label="Street Name"
        />
      </v-col>

      <v-col cols="5">
        <LocationPickerComboBox
          v-model:input-combo-box="streetname"
          :items="streetnameSuggestions"
          :loading="streetnameSuggestionsLoading"
          :no-data-text="noDataComboText"
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
import { watchDebounced } from '@vueuse/core'

const { cookieStreet } = useCookieUserConfig();
const streetname = ref(cookieStreet.value.streetname);
const streetno = ref(cookieStreet.value.streetno);
const locationPickerActive = ref(false);

const streetnameSuggestions = ref<string[]>([]);
const streetnoSuggestions = ref<string[]>([]);

const streetnameSuggestionsLoading = ref<boolean>(false);

//@TODO: how to get cookieStreet as argument? it fails due to type, beacuse in template it is "unpacked"
function storeStreetInCookie(streetname: string, streetno: string) {
  cookieStreet.value.streetname = streetname;
  cookieStreet.value.streetno = streetno;
  locationPickerActive.value = false
}

const noDataComboText = computed( () => {
  if (!streetname.value || streetname.value.length < 1) {
    return "Please enter a value"
  } else {
    return "Unknown Value"
  }

})

const debounceConfig = { debounce: 700, maxWait: 2000 };

watchDebounced(
  streetname, 
  async (newStreetname, _oldStreetname) => {
    streetno.value = ""
    if (!newStreetname || newStreetname.length < 1) {
      streetnameSuggestions.value = []
      return;
    }
    streetnameSuggestionsLoading.value = true;

    const response = await $fetch("/api/v1/addresssuggestion", {
      query: {
        streetname: newStreetname
      }
    })
    console.log(response);
    streetnameSuggestions.value = response || []
    streetnameSuggestionsLoading.value = false;

  },
  debounceConfig
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
  debounceConfig
)

</script>

<style>


</style>