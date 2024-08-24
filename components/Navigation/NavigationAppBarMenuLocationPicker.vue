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
    <BaseLocationPicker/>
  </v-menu>
</template>

<script setup lang="ts">
  import BaseLocationPicker from '../LocationPicker/BaseLocationPicker.vue';
  const { hasSetStreet } = useCookieUserConfig();

</script>