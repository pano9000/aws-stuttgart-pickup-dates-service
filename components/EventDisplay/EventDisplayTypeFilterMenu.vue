
<template>
  <v-tooltip :text="i18n.t('eventDisplayTypeFilterMenu.tooltip')" location="top">
    <template #activator="{ props: tooltipProps }">
      <div v-bind="tooltipProps">
        <v-menu
          open-on-hover
          eager
          :close-on-content-click="false"
        >
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              :icon="mdiFilterMenu"
              :color="isFilteringByType ? 'green' : undefined"
            />
            <!-- @TODO add correct ARIA props -->
            <span
              v-show="isFilteringByType"
              class="text-disabled"
            >
              {{ i18n.t("eventDisplayTypeFilterMenu.labelActiveFilter")}}
            </span>
            </template>

            <template #default>
              <EventTypeSelector v-model="modelSelectedEventTypes" class="elevation-8"/>
            </template>
          </v-menu>
        </div>
      </template>
  </v-tooltip>
</template>

<script setup lang="ts">
  import type { AwsApiServiceEventTypeName } from "~/server/services/AwsApiService";
  import EventTypeSelector from "../EventTypeSelector.vue";
  import { mdiFilterMenu } from "@mdi/js";

  const modelSelectedEventTypes = defineModel<AwsApiServiceEventTypeName[]>();
  const isFilteringByType = computed(() => (modelSelectedEventTypes.value?.length != eventTypeMap.size) ? true : false)
  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  multiMergeLocaleMessage("eventDisplayTypeFilterMenu", [
    ["tooltip", {"de": "Nach Abholart filtern", "en": "Filter by Pickup Type"}],
    ["labelActiveFilter", {"de": "Filter aktiv", "en": "Active Filter"}]
  ]);
</script>