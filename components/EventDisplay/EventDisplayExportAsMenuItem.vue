<template>
  <v-list-item>
     {{ props.title }}
     <!-- @TODO: check accessibility! -->
     <DownloadButton :download-url="props.exportUrl"/>
     <CopyToClipboardButton :text-to-copy="props.exportUrl"/>
     <CustomizeExportButton :export-customizer-component="props.exportCustomizerComponent"/>
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