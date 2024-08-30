<template>
  <v-tooltip :text="i18n.t('eventDisplayExportAsMenu.tooltip')" location="top">
    <template #activator="{ props: tooltipProps }">
      <div v-bind="tooltipProps">
        <v-menu
          open-on-hover
          eager
          :close-on-content-click="false"
        >
          <template #activator="{ props: menuProps }">
            <v-btn v-bind="menuProps" :icon="mdiExportVariant"/>
          </template>

          <template #default>
            <v-list>
              <EventDisplayExportAsMenuItem title="CSV" :export-url="'http://abc.de'"/>
              <EventDisplayExportAsMenuItem title="JSON" :export-url="'http://abc.de'"/>

              <v-list-item @click="() => console.log('TODO iCal export')">iCal</v-list-item>
            </v-list>
          </template>

        </v-menu>
      </div>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
  import type { AwsApiServiceEventTypeName } from "~/server/services/AwsApiService";
  import EventDisplayExportAsMenuItem from "./EventDisplayExportAsMenuItem.vue";
  import { mdiExportVariant } from "@mdi/js";

  // const props = defineProps<{
  //   selectedEventTypes: AwsApiServiceEventTypeName[];
  // }>();

  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  multiMergeLocaleMessage("eventDisplayExportAsMenu", [
    ["tooltip", {"de": "Daten Exportieren", "en": "Export Data"}],
  ]);
</script>