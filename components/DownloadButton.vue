<template>
  <BaseToolTipButton 
    v-slot="tooltipActivator"
    :tooltip-title="i18n.t(`downloadButton.tooltipDownload`)"
  >
    <v-btn
      :icon="mdiDownload"
      :href="props.downloadUrl"
      target="_blank"
      v-bind="tooltipActivator"
    />
  </BaseToolTipButton>

</template>

<script setup lang="ts">
  import { mdiDownload } from "@mdi/js"
  import BaseToolTipButton from "./BaseToolTipButton.vue";

  const { i18n, multiMergeLocaleMessage }  = useCustomI18n();

  const props = defineProps<{
    downloadUrl: string
  }>();

  multiMergeLocaleMessage("downloadButton", [
    ["tooltipDownload", {de: "Herunterladen", en: "Download"}],
  ]);


</script>