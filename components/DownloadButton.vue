<template>
  <v-tooltip :text="i18n.t(`downloadButton.tooltipDownload`)" location="top">
    <template #activator="{ props: activatorProps }">
      <v-btn 
        :icon="mdiDownload"
        v-bind="activatorProps" 
        :href="props.downloadUrl"
        target="_blank"
      />
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
  import { mdiDownload } from "@mdi/js"

  const { i18n, multiMergeLocaleMessage }  = useCustomI18n();

  const props = defineProps<{
    downloadUrl: string
  }>();

  multiMergeLocaleMessage("downloadButton", [
    ["tooltipDownload", {de: "Herunterladen", en: "Download"}],
  ]);


</script>