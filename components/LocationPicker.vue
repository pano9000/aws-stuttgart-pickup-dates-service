<template>
  <v-menu
    id="menu-locationpicker"
    width="100vw"
    :close-on-content-click="false"
    open-on-hover
    eager
  >
    <template #activator="{ props }">
      <v-btn 
        icon="mdi-office-building-marker"
        v-bind="props"
        :color="(!hasSetStreet) ? 'red' : undefined"
      />
    </template>

    <v-card 
      class="pa-8"
    >
      <v-form 
        ref="form"
        class="d-flex align-baseline ga-4"
        :disabled="!isLocationPickerActive"
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
            <v-tooltip
              :text="(isLocationPickerActive) ? `Save` : `Edit`"
              location="top"
            >
              <template #activator="{ props }">
                <v-btn
                  v-if="isLocationPickerActive"
                  :disabled="!form?.isValid"
                  type="submit"
                  icon="mdi-check-bold"
                  v-bind="props"
                />

                <v-btn
                  v-else 
                  type="button"
                  icon="mdi-pencil"
                  v-bind="props" 
                  @click="isLocationPickerActive = !isLocationPickerActive"
                />
              </template>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { VForm } from 'vuetify/components';
import { useCookieUserConfig } from '~/composables/useCookieUserConfig';

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