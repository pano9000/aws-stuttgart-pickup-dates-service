<template>
  <v-dialog v-model="modelActive">
    <template #default>
      <v-card class="pa-4">
        <v-card-title>
          <span><v-icon :icon="mdiCookie"/></span>
          {{ i18n.t("cookieNoticeDialog.title") }}
        </v-card-title>
        <v-card-text>
         <p>
           {{ i18n.t("cookieNoticeDialog.text") }}
         </p>
          <ul style="list-style-position: inside;" class="my-4">
            <li v-for="entry in ['address', 'pickupPreference', 'language', 'displayPreference']" :key="entry">
              {{ i18n.t(`cookieNoticeDialog.${entry}`) }}
            </li>
          </ul>
          <p>
            {{ i18n.t("cookieNoticeDialog.cookieDelete") }}
          </p>
        </v-card-text>

        <v-card-actions>
          <v-btn :icon="mdiCheck" @click="modelActive = false"/>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>

</template>

<script setup lang="ts">
  import { mdiCheck, mdiCookie } from "@mdi/js";

  const modelActive = defineModel<boolean>("active");
  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  multiMergeLocaleMessage("cookieNoticeDialog", [
    ["title", {de: "Informationen über eingesetzte Cookies", en: "Information about Cookies in use"}],
    ["text", {
      de: "Diese Webseite verwendet ausschließlich funktionale Cookies, um Ihnen die Verwendung der Website zu ermöglichen. Hierzu werden folgende Daten als Cookie lokal in ihrem Browser gespeichert:",
      en: "This website utilizes exclusively functional cookies, to make the site useable for you. For this prupose the following data are stored as cookies locally in your browser:"}
    ],
    ["address", {de: "Abholadresse und -hausnummer", en: "Pickup Address and Street Number"}],
    ["pickupPreference", {de: "Bevorzugte Abholarten", en: "Pickup Type Preferences"}],
    ["language", {de: "Spracheinstellungen", en: "Language Settings"}],
    ["displayPreference", {de: "Ansichtseinstellungen", en: "Display Preferences"}],
    ["cookieDelete", {
      de: "Sie können diese Daten löschen lassen, in dem Sie die Funktion 'Cookies löschen' Ihres Browsers verwenden.",
      en: "You can delete this data by using your browser's 'Clear Cookies' function."
    }]
  ]);
</script>