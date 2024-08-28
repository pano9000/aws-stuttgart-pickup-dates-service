<template>
  <v-select
    v-model="modelItemsPerPage"
    v-bind="tooltipProps"
    :items="props.items"
    hide-details
    type="number"
    :label="i18n.t('eventDisplayItemsPerPageSelector.tooltip')"
  />
</template>

<script setup lang="ts">
  const modelItemsPerPage = defineModel<number>();
  const props = defineProps<{
    items: number[]
  }>();

  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  multiMergeLocaleMessage("eventDisplayItemsPerPageSelector", [
    ["tooltip", {"de": "Einträge pro Seite", "en": "Items per Page"}],
  ]);
</script>