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
              <EventDisplayExportAsMenuItem 
                title="CSV" 
                :export-url="getButtonApiUrl('csv')"
              />

              <EventDisplayExportAsMenuItem
                title="JSON"
                :export-url="getButtonApiUrl('json')"
              />

              <EventDisplayExportAsMenuItem
                title="iCalendar"
                :export-url="getButtonApiUrl('ical')"
              />
            </v-list>
          </template>

        </v-menu>
      </div>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
  import EventDisplayExportAsMenuItem from "./EventDisplayExportAsMenuItem.vue";
  import { mdiExportVariant } from "@mdi/js";
  import getApiUrl from "~/utils/getApiUrl.ts";
  import type { RetrieveDataFacadeFormat } from "~/server/services/RetrieveDataFacade";

  const props = defineProps<{
    apiEndpoint: string;
  }>();

  const { i18n, multiMergeLocaleMessage } = useCustomI18n();
  const { cookieEventTypeSelector, cookieLanguage, cookieStreet } = useCookieUserConfig();

  function getButtonApiUrl(format: RetrieveDataFacadeFormat) {
    return getApiUrl({
      endpointName: props.apiEndpoint,
      streetname: cookieStreet.value.streetname,
      streetno: cookieStreet.value.streetno,
      eventTypes: cookieEventTypeSelector.value,
      format: format,
      language: cookieLanguage.value
    })
  }

  multiMergeLocaleMessage("eventDisplayExportAsMenu", [
    ["tooltip", {"de": "Daten Exportieren", "en": "Export Data"}],
  ]);
</script>