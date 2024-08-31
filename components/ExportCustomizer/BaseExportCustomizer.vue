<template>
  <v-container class="bg-grey-lighten-5 rounded-lg elevation-2 export-customizer-wrap">
    <slot/>
  </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped>
  .export-customizer-wrap {
    max-height: 80vh;
    overflow: scroll;
    max-width: 50rem;
  }
</style>