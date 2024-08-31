<template>
  <BaseToolTipButton 
    v-slot="tooltipActivator"
    :tooltip-title="i18n.t(`clipboardCopyButton.tooltip${(!copiedToClipboard) ? 'Copy' : 'Copied'}`)"
  >
    <v-btn
      :icon="(!copiedToClipboard) ? mdiClipboardTextOutline : mdiClipboardCheckOutline"
      v-bind="tooltipActivator"
      @click="() => copyToClipboardHandler(props.textToCopy)"
    />
  </BaseToolTipButton>

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