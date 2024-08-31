<template>
  <v-list-item>
    <div class="d-flex ga-2 py-2 justify-space-between align-center">

      <span>{{ props.title }}</span>

      <div class="export-button-wrap">
        <!-- @TODO: check accessibility! -->
        <DownloadButton :download-url="props.exportUrl"/>
        <CopyToClipboardButton :text-to-copy="props.exportUrl"/>
        <CustomizeExportButton :export-customizer-component="props.exportCustomizerComponent"/>
      </div>
    </div>
  </v-list-item>
</template>
 
 <script setup lang="ts">
   import DownloadButton from "../DownloadButton.vue";
   import CopyToClipboardButton from "../CopyToClipboardButton.vue";
   import CustomizeExportButton from "../CustomizeExportButton.vue";
   const props = defineProps<{
     title: string;
     exportUrl: string;
     exportCustomizerComponent?: any | undefined; //@TODO correctly type
   }>();

 </script>

 <style lang="css">
.export-button-wrap > * {
  margin: 0rem .25rem;
}
 </style>