<template>
  <v-combobox
    v-model="modelComboBox"
    :label="props.label"
    :items="suggestions"
    :prepend-icon="props.icon"
    :hide-no-data="false"
    :no-data-text="noDataComboText"
    :loading="isSuggestionsLoading"
    hide-details="auto"
    :clearable="isEnabled"
    required
  />
</template>

<script setup lang="ts">
  import { watchDebounced } from '@vueuse/core'

  const props = defineProps<{
    label: string;
    icon: string;
    noDataText: string;
    mode: "streetname" | "streetno";
    isEnabled: boolean;
  }>()

  const modelComboBox = defineModel<string>("inputComboBox");
  const modelStreetname = defineModel<string>("streetname");
  const modelStreetno = defineModel<string>("streetno");

  const suggestions = ref<string[]>([]);
  const isSuggestionsLoading = ref<boolean>(false);

  const noDataComboText = computed( () => {
    if (!modelComboBox.value || modelComboBox.value.length < 1) {
      return `Please enter a ${props.noDataText}`
    }
    return `Unknown ${props.noDataText}`
  })


  const debounceConfig = { debounce: 700, maxWait: 2000 };

  watchDebounced(
    modelComboBox, 
    async (curr, _prev) => {

      if (props.mode === "streetname") {
        modelStreetno.value = ""
      }
      if (!curr || curr.length < 1) {
        suggestions.value = []
        return;
      }

      isSuggestionsLoading.value = true;

      //@TODO - do not trigger fetch again, if change in model is due to people selecting value from combobox
      const response = await $fetch("/api/v1/addresssuggestion", {
        query: {
          streetname: modelStreetname.value,
          streetno: (props.mode === "streetno") ? modelStreetno.value : undefined
        }
      })

      console.log(props.mode, response);
      suggestions.value = response || []
      isSuggestionsLoading.value = false;

    },
    debounceConfig
  )

</script>

<style>

</style>