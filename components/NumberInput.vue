<template>
  <div class="numberinput__wrap">
    <v-icon v-if="props.icon" :icon="props.icon" class="mr-2"/>
    <input
      :id=id
      v-model.lazy="modelInputNumber"
      type="number"
      class="mr-2"
      :min=min
      :max=max
      :step=step
      :disabled="disabled"
    >
    <label :for="id">{{ label }}</label>

  </div>

</template>


<script setup lang="ts">
  //@TODO RTL support for label in template 
  const modelInputNumber = defineModel<number>("inputNumber");


  const props = defineProps<{
    icon?: string,
    disabled?: boolean,
    min?: number,
    max?: number,
    step?: number,
    label?: string,
    id?: string
  }>();

</script>

<style scoped>

.numberinput__wrap {
  min-height: var(--v-input-control-height);
  align-content: center;
}

.numberinput__wrap input {
  padding: .25rem;
  border: 1px solid black; 
  border-radius: 5px; /*@TODO: check how to use same style as vuetify here*/
}

.numberinput__wrap input:hover {
  cursor: text;
  background-color: gainsboro; /*@TODO: check how to use same style as vuetify here*/
}

</style>