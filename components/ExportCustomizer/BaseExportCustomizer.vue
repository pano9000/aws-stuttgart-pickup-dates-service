<template>
  <v-container class="bg-grey-lighten-5 rounded-lg elevation-2 export-customizer-wrap">
    <h1 class="text-center">{{ props.title }}</h1>
    <slot/>
  </v-container>
</template>

<script setup lang="ts">
  const props = defineProps<{
    title: string;
  }>();
  
</script>

<style scoped>
  .export-customizer-wrap {
    max-height: 80vh;
    overflow: scroll;
    max-width: 50rem;
  }
</style>