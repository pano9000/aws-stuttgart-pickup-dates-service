<template>
  <v-tooltip :text="props.tooltipTitle" location="top">
    <template #activator="{ props: activatorProps }">
      <slot v-bind="activatorProps"/>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">

const props = defineProps<{
    tooltipTitle: string;
  }>();

</script>