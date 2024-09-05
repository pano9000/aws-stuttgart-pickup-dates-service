<template>
  <v-app-bar
    color="primary"
  >

    <template #prepend>
      <v-app-bar-nav-icon @click.stop="activeDrawer = !activeDrawer"/>
    </template>

    <v-app-bar-title>
      <NuxtLink to="/" class="nuxtlink">
        {{ i18n.t("navigationAppBar.title")}}
      </NuxtLink>
    </v-app-bar-title>

    <template #append>
      <NavigationAppBarMenuLocationPicker/>
      <NavigationAppBarMenuLanguage/>
      <!-- <v-btn :icon="mdiDotsVertical"/> -->
    </template>

  </v-app-bar>
</template>

<script setup lang="ts">
  import NavigationAppBarMenuLanguage from './NavigationAppBarMenuLanguage.vue';
  import NavigationAppBarMenuLocationPicker from "./NavigationAppBarMenuLocationPicker.vue"
  //import { mdiDotsVertical } from "@mdi/js";
  const { i18n, multiMergeLocaleMessage } = useCustomI18n();
  const activeDrawer = defineModel<boolean>("activeDrawer", {default: false})

  multiMergeLocaleMessage("navigationAppBar", [
    ["title", {de: "Müll-Abfuhrtermine-Tool", en: "Trash Collection Dates Tool"}],
  ]);
</script>