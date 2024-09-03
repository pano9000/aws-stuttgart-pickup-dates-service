<template>
  <v-alert
    v-if="!hasSetStreet"
    type="warning"
    :title="i18n.t('warnNoSetStreet.infoText')"
  />
</template>

<script setup lang="ts">
  import { useCookieUserConfig } from "~/composables/useCookieUserConfig.ts";
  const { hasSetStreet } = useCookieUserConfig();
  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  multiMergeLocaleMessage("warnNoSetStreet", [
    [
      "infoText", {
        de: "Bitte wählen Sie zuerst eine Adresse mit dem Adressauswähler aus.",
        en: "Please select an Address with the location picker first."
      }
    ]
  ]);
</script>