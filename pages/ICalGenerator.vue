<template>
  <v-container>
    <WarnNoSetStreet/>
    <h1 class="text-h3 text-center">{{i18n.t("iCalGen.pageTitle")}}</h1>
    <p>{{ i18n.t("iCalGen.pageSubtitle") }}</p>

    <ExportCustomizerICal/>
  </v-container>
</template>

<script setup lang="ts">
  import ExportCustomizerICal from "~/components/ExportCustomizer/ExportCustomizerICal.vue";

  const { i18n, multiMergeLocaleMessage }  = useCustomI18n();

  multiMergeLocaleMessage("iCalGen", [
    ["pageTitle", {de: "iCal-Kalendar-Link Erstellen", en: "Generate iCal-Calendar-Link"}],
    [
      "pageSubtitle", {
        de: "Benutzen Sie die Optionen unten, um einen benutzerdefinierten iCal-Kalender-Link für die Abholungen zu erstellen, den Sie in Ihre Kalender-Anwendung einbinden können.", 
        en: "Use the options below to generate a custom iCal Calendar link for the pickup dates, that you can import into your calendar application"
      }
    ],
  ]);
</script>