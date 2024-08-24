<template>
  <v-app>
    <BaseNavigation/>
    <!-- max-width="1280px" -->
    <v-main
    >
      <NuxtPage />
    </v-main>
    <Footer/>
  </v-app>
</template>

<script setup lang="ts">
  import BaseNavigation from './components/Navigation/BaseNavigation.vue';
  import Footer from './components/Footer.vue';
</script>