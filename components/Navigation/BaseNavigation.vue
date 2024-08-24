<template>
  <AppBar v-model:active-drawer="drawerVisible"/>
  <Drawer v-model:active="drawerVisible"/>
</template>

<script setup lang="ts">
  import Drawer from './Drawer.vue';
  import AppBar from './AppBar.vue';
  const drawerVisible = ref(false);
</script>