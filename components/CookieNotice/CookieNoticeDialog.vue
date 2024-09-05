<template>
  <v-dialog v-model="modelActive">
    <template #default>
      <v-card class="pa-4">
        <v-card-title>
          {{ i18n.t("cookieNoticeDialog.title") }}
        </v-card-title>
        <v-card-text>
         {{ i18n.t("cookieNoticeDialog.text") }}
          <ul style="list-style-position: inside;" class="mt-4">
            <li v-for="entry in ['address', 'language', 'pickupPreference', 'displayPreference']" :key="entry">
              {{ i18n.t(`cookieNoticeDialog.${entry}`) }}
            </li>
          </ul>
        </v-card-text>

        <v-card-actions>
          <v-btn :icon="mdiCheck" @click="modelActive = false"/>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>

</template>

<script setup lang="ts">
  import { mdiCheck } from "@mdi/js";

  const modelActive = defineModel<boolean>("active");
  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  multiMergeLocaleMessage("cookieNoticeDialog", [
    ["title", {de: "Informationen über eingesetzte Cookies", en: "Information about Cookies in use"}],
    ["text", {
      de: "Diese Seite verwendet ausschließlich funktionale Cookies, um folgende Einstellungen zu speichern:", 
      en: "This site utilizes exclusively functional cookies, to store the following settings:"}
    ],
    ["address", {de: "Adresse", en: "Address"}],
    ["language", {de: "Sprache", en: "Language"}],
    ["pickupPreference", {de: "Bevorzugte Abholarten", en: "Pickup Type Preferences"}],
    ["displayPreference", {de: "Ansichtseinstellungen", en: "Display Preferences"}],
  ]);
</script>