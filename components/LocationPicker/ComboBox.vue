<template>
  <v-combobox
    v-model="modelComboBox"
    :label="label"
    :items="items"
    :prepend-icon="icon"
    :hide-no-data="false"
    :no-data-text="noDataComboText"
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

  const noDataComboText = computed( () => {
  if (!modelComboBox.value || modelComboBox.value.length < 1) {
    return `Please enter a ${props.noDataText}`
    }
    return `Unknown ${props.noDataText}`
  })

</script>

<style>

</style>