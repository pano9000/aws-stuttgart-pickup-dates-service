<template>
  <v-app-bar
    color="primary"
  >

    <template #prepend>
      <v-app-bar-nav-icon @click.stop="activeDrawer = !activeDrawer"/>
    </template>

    <v-app-bar-title>
      <NuxtLink to="/">
        Application Bar
      </NuxtLink>
    </v-app-bar-title>

    <template #append>
      <NavigationAppBarMenuLocationPicker/>
      <TranslateMenu/>
      <v-btn icon="mdi-dots-vertical"/>
    </template>

  </v-app-bar>
</template>

<script setup lang="ts">
  import TranslateMenu from './TranslateMenu.vue';
  import NavigationAppBarMenuLocationPicker from "./NavigationAppBarMenuLocationPicker.vue"
  const activeDrawer = defineModel<boolean>("activeDrawer", {default: false})
</script>