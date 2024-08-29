
<template>
  <v-tooltip :text="i18n.t('eventDisplayExportAsMenu.tooltip')" location="top">
    <template #activator="{ props: tooltipProps }">
      <div v-bind="tooltipProps">
        <v-menu
          open-on-hover
          eager
        >
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              :icon="mdiExportVariant "
            />
            </template>

            <template #default>
              <v-list>
                <v-list-item @click="() => console.log('TODO CSV export')">CSV</v-list-item>
                <v-list-item @click="() => console.log('TODO JSON export')">JSON</v-list-item>
                <v-list-item @click="() => console.log('TODO iCal export')">iCal</v-list-item>

              </v-list>
            </template>
          </v-menu>
        </div>
      </template>
  </v-tooltip>
</template>

<script setup lang="ts">
  import { mdiExportVariant  } from "@mdi/js";

  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  multiMergeLocaleMessage("eventDisplayExportAsMenu", [
    ["tooltip", {"de": "Daten Exportieren", "en": "Export Data"}],
  ]);
</script>