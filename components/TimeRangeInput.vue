<template>
  <div class="timerangeinput__wrap">
    <v-icon v-if="props.icon" :icon="props.icon" class="mr-2"></v-icon>
    <input
      v-model="modelStartTime"
      type="time"
    >
    —
    <input
      v-model="modelEndTime"
      type="time"
    >
  </div>

</template>


<script setup lang="ts">

  const modelStartTime = defineModel<string>("startTime");
  const modelEndTime = defineModel<string>("endTime");

  const props = defineProps<{
    icon?: string
  }>();

</script>

<style scoped>

.timerangeinput__wrap {
  min-height: var(--v-input-control-height);
  align-content: center;
}

.timerangeinput__wrap input {
  border: 1px solid black; 
  border-radius: 5px; /*@TODO: check how to use same style as vuetify here*/
}

.timerangeinput__wrap input:hover {
  cursor: text;
  background-color: gainsboro; /*@TODO: check how to use same style as vuetify here*/
}
</style>