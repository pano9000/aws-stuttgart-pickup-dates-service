<template>
  <v-combobox
    v-model="modelComboBox"
    :label="props.label"
    :items="suggestions"
    :prepend-icon="props.icon"
    :hide-no-data="false"
    :no-data-text="noDataComboText"
    :loading="isSuggestionsLoading"
    :clearable="isEnabled"
    :no-filter="true"
    :rules="validationRule"
    validate-on="input"
    required
  />
</template>

<script setup lang="ts">
  import { watchDebounced } from '@vueuse/core'
  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  const props = defineProps<{
    label: string;
    icon: string;
    mode: "streetname" | "streetno";
    isEnabled: boolean;
  }>()

  const modelComboBox = defineModel<string>("inputComboBox");
  const modelStreetname = defineModel<string>("streetname");
  const modelStreetno = defineModel<string>("streetno");

  const suggestions = ref<string[]>([]);
  const isSuggestionsLoading = ref<boolean>(false);


  multiMergeLocaleMessage("locationPickerComboBox", [
    ["unknownstreetname", {de: "Unbekannte Straße", en: "Unknown Street Name"}],
    ["unknownstreetno", {de: "Unbekannte Hausnummer", en: "Unknown Street Number"}],
    ["enterstreetname", {de: "Bitte geben Sie eine Straße ein", en: "Please enter a street name"}],
    ["enterstreetno", {de: "Unbekannte Hausnummer", en: "Unknown Street Number"}],
    ["selectValidEntry", {de: "Bitte wählen Sie einen Eintrag aus den Vorschlägen aus", en: "Please select an entry from the suggestions"}],
    ["labelLoading", {de: "Lädt…", en: "Loading…"}]
  ])


  const noDataComboText = computed( () => {
    if (!modelComboBox.value || modelComboBox.value.length < 1) {
      return i18n.t(`locationPickerComboBox.enter${props.mode}`)
    }
    return i18n.t(`locationPickerComboBox.unknown${props.mode}`)
  })

  let hasFetched: true | undefined = undefined;
  const hasInitialStoredData = computed( () => modelComboBox.value && !hasFetched)

  const validationRule = [
    (value: string) => {
      return (hasInitialStoredData.value)
        ? true
        : suggestions.value.includes(value) || i18n.t("locationPickerComboBox.selectValidEntry")
    }
  ];

  const debounceConfig = { debounce: 700, maxWait: 2000 };

  watchDebounced(
    modelComboBox,
    async (curr, _prev) => {

      // reset streetno, when streetname changes
      if (props.mode === "streetname") modelStreetno.value = "";

      // avoid fetch attempt for empty values
      if (!curr || curr.length < 1) return suggestions.value = [];

      isSuggestionsLoading.value = true;

      //@TODO - find a better way - this is hacky, people can select "Loading..." as value from the list in certain situations
      suggestions.value = [i18n.t("locationPickerComboBox.labelLoading")];

      //@TODO - do not trigger fetch again, if change in model is due to people selecting value from combobox
      //@TODO - fetch error handling?
      const response = await $fetch("/api/v1/addresssuggestion", {
        query: {
          streetname: modelStreetname.value,
          streetno: (props.mode === "streetno") ? modelStreetno.value : undefined
        }
      })

      hasFetched = true;
      suggestions.value = response || [];
      isSuggestionsLoading.value = false;
    },

    debounceConfig
  )

</script>

<style>

</style>