<template>
  <v-container>
    <h1>{{ i18n.t("legalNotice.pageTitle") }}</h1>
    <address>
      <p v-for="(line) in legalNoticeLines" :key="line">
        {{ runtimeConfig.public[line] }}
      </p>
    </address>
  </v-container>
</template>

<script setup lang="ts">

  const { i18n, multiMergeLocaleMessage }  = useCustomI18n();
  const runtimeConfig = useRuntimeConfig();
  const legalNoticeLines = Object.keys(runtimeConfig.public).filter(key => key.startsWith("legalNotice"))

  multiMergeLocaleMessage("legalNotice", [
    ["pageTitle", {de: "Impressum", en: "Legal Notice"}],
  ]);

</script>