<template>
  <v-tooltip :text="i18n.t(`clipboardCopyButton.tooltip${(!copiedToClipboard) ? 'Copy' : 'Copied'}`)" location="top">
    <template #activator="{ props: activatorProps }">
      <v-btn 
        :icon="(!copiedToClipboard) ? mdiClipboardTextOutline : mdiClipboardCheckOutline"
        v-bind="activatorProps" 
        @click="() => copyToClipboardHandler(props.textToCopy)"
      />
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
  import { mdiClipboardTextOutline, mdiClipboardCheckOutline } from "@mdi/js"

  const { copiedToClipboard, copyToClipboardHandler } = useCopyToClipboard();
  const { i18n, multiMergeLocaleMessage }  = useCustomI18n();
  
  const props = defineProps<{
    textToCopy: string
  }>();

  multiMergeLocaleMessage("clipboardCopyButton", [
    ["tooltipCopy", {de: "Kopieren", en: "Copy"}],
    ["tooltipCopied", {de: "Kopiert", en: "Copied"}],
  ]);
</script>