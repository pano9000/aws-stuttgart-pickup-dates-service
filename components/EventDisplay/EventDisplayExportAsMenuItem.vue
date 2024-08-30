<template>
 <v-list-item>
    {{ props.title }}
    <!-- @TODO: check accessibility! -->
    <DownloadButton :download-url="exportUrl"/>
    <CopyToClipboardButton :text-to-copy="props.exportUrl"/>
  </v-list-item>
</template>

<script setup lang="ts">
  import CopyToClipboardButton from "../CopyToClipboardButton.vue";
  import DownloadButton from "../DownloadButton.vue";

  const props = defineProps<{
    title: string;
    exportUrl: string;
  }>();

</script>