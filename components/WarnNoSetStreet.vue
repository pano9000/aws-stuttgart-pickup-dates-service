<template>
  <v-alert
    v-if="!hasSetStreet"
    type="info"
  >
    Please select your street name and street number first with the location picker.
  </v-alert>
</template>

<script setup lang="ts">
  import { useCookieUserConfig } from "~/composables/useCookieUserConfig.ts";
  const { hasSetStreet } = useCookieUserConfig();
</script>