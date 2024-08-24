<template>
  <NavigationAppBar v-model:active-drawer="drawerVisible"/>
  <NavigationDrawer v-model:active="drawerVisible"/>
</template>

<script setup lang="ts">
  import NavigationAppBar from './NavigationAppBar.vue';
  import NavigationDrawer from './NavigationDrawer.vue';
  const drawerVisible = ref(false);
</script>