<template>
  <v-select
    v-model="modelItemsPerPage"
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
  const { cookieEventDisplayItemsPerPage } = useCookieUserConfig();

  modelItemsPerPage.value = cookieEventDisplayItemsPerPage.value || 12;

  watch(modelItemsPerPage, (value) => {
    if (value) cookieEventDisplayItemsPerPage.value = value
  });

  multiMergeLocaleMessage("eventDisplayItemsPerPageSelector", [
    ["tooltip", {"de": "Einträge pro Seite", "en": "Items per Page"}],
  ]);
</script>