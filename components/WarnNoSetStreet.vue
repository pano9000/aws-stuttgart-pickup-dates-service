<template>
  <v-alert
    v-if="!hasSetStreet"
    type="info"
  >
    {{ i18n.t("warnNoSetStreet.infoText") }}
  </v-alert>
</template>

<script setup lang="ts">
  import { useCookieUserConfig } from "~/composables/useCookieUserConfig.ts";
  const { hasSetStreet } = useCookieUserConfig();
  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  multiMergeLocaleMessage("warnNoSetStreet", [[
      "infoText", {
        de: "Bitte wählen Sie zuerst eine Adresse mit dem Addressauswähler aus.", 
        en: "Please select an Address with the location picker first."
      }
    ]
  ]);
</script>