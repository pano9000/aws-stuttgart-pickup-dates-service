<template>

  <div>
    <IconCarrot v-if="props.eventType == 'organic'" :size="props.size || 24" />
    <IconTrash v-else-if="props.eventType == 'residual'" :size="props.size || 24" />
    <IconFileDescription v-else-if="props.eventType == 'paper'" :size="props.size || 24" />
    <IconRecycle v-else-if="props.eventType == 'recycle'" :size="props.size || 24" />
  </div>

</template>

<script setup lang="ts">
  import { IconCarrot, IconRecycle, IconTrash, IconFileDescription  } from "@tabler/icons-vue";
  import type { AwsApiServiceEventTypeName } from "~/server/services/AwsApiService";
  const props = defineProps<{
    eventType: AwsApiServiceEventTypeName;
    size?: number;
  }>();
</script>