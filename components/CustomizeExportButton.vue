<template>
  <v-dialog max-width="50vw" max-height="50vh">
    <template #activator="{ props: dialogActivatorProps }">
      <BaseToolTipButton 
        v-slot="tooltipActivator"
        :tooltip-title="i18n.t(`customizeExportButton.tooltipCustomize`)"
      >
        {{ props.exportCustomizerComponent }}
        <v-btn
          :icon="mdiCogOutline"
          v-bind="{...tooltipActivator, ...dialogActivatorProps}"
          :disabled="!props.exportCustomizerComponent"
        />
      </BaseToolTipButton>
    </template>

    <template #default="{ isActive }">
      <component :is="props.exportCustomizerComponent" v-if="exportCustomizerComponent && isActive"/>
    </template>

  </v-dialog>
</template>

<script setup lang="ts">
  import { mdiCogOutline } from "@mdi/js"
  import BaseToolTipButton from "./BaseToolTipButton.vue";

  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  const props = defineProps<{
    disabled?: boolean
    exportCustomizerComponent: any;
  }>();

  multiMergeLocaleMessage("customizeExportButton", [
    ["tooltipCustomize", {de: "Export anpassen", en: "Customize Export"}],
  ]);

</script>
