<template>
  <v-combobox
    v-model="modelComboBox"
    :label="label"
    :items="items"
    :prepend-icon="icon"
    :hide-no-data="false"
    :no-data-text="noDataText"
    :loading="loading"
    hide-details="auto"
    clearable
    required
  />
</template>

<script setup lang="ts">

  defineProps<{
    label: string;
    icon: string;
    loading: boolean;
    items: string[];
    noDataText: string;
  }>()

  const modelComboBox = defineModel<string>("inputComboBox");

</script>

<style>

</style>