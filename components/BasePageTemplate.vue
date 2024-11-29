<template>
  <v-container
    tag="main"
  >
    <header class="mb-16 text-center">
      <h1 class="text-h3 mb-4">{{ props.pageTitle }}</h1>
      <p v-if="props.pageSubtitle" class="text-h5 mb-4">{{ props.pageSubtitle }}</p>
      <slot name="headerAfterSubtitle"/>
    </header>

    <section>
      <slot name="mainContent"/>
    </section>

  </v-container>
</template>

<script setup lang="ts">

const props = defineProps<{
  pageTitle: string;
  pageSubtitle?: string;
}>();

</script>

<style>

</style>