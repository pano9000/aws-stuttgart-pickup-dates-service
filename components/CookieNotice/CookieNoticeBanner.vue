<template>
  <v-banner
    v-if="!cookieHideCookieNotice"
    :icon="mdiCookie"
    bg-color="grey-lighten-2"
    lines="one"
  >
  <v-banner-text>
      {{ i18n.t("cookieNotice.text") }}
    </v-banner-text>

    <v-banner-actions>
      <BaseToolTipButton v-slot="tooltipActivator" :tooltip-title="i18n.t(`cookieNotice.btnDontShow`)">
        <v-btn :icon="mdiCheck" v-bind="tooltipActivator" @click="cookieHideCookieNotice = true"/>
      </BaseToolTipButton>

      <BaseToolTipButton v-slot="tooltipActivator" :tooltip-title="i18n.t(`cookieNotice.btnMoreInfo`)">
        <v-btn :icon="mdiInformationSlabCircleOutline" v-bind="tooltipActivator" @click="$emit('openDialog')"/>
      </BaseToolTipButton>
    </v-banner-actions>
  </v-banner>

  </template>

  <script setup lang="ts">
    import { mdiCookie, mdiCheck, mdiInformationSlabCircleOutline } from "@mdi/js";
    const { i18n, multiMergeLocaleMessage } = useCustomI18n();
    const { cookieHideCookieNotice } = useCookieUserConfig();

    defineEmits(["openDialog"]);

    multiMergeLocaleMessage("cookieNotice", [
      ["title", {de: "Cookies", en: "Cookies"}],
      ["text", {de: "Diese Seite verwendet ausschließlich funktionale Cookies.", en: "This site utilizes exclusively functional cookies."}],
      ["btnDontShow", {de: "Nicht mehr anzeigen", en: "Don't show anymore"}],
      ["btnMoreInfo", {de: "Weitere Informationen", en: "Further Information"}]
    ]);
  </script>