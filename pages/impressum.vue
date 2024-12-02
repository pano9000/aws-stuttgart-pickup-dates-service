<template>

  <BasePageTemplate
    :page-title="i18n.t('legalNotice.pageTitle')"
    :page-subtitle="i18n.t('legalNotice.pageSubtitle')"
  >
    <template #mainContent>
      <address class="text-center">
        <p v-for="(line) in legalNoticeLines" :key="line">
          {{ runtimeConfig.public[line] }}
        </p>
      </address>
    </template>
  </BasePageTemplate>

</template>

<script setup lang="ts">
  import BasePageTemplate from '~/components/BasePageTemplate.vue';

  const { i18n, multiMergeLocaleMessage }  = useCustomI18n();
  const runtimeConfig = useRuntimeConfig();
  const legalNoticeLines = Object.keys(runtimeConfig.public).filter(key => key.startsWith("legalNotice"))

  multiMergeLocaleMessage("legalNotice", [
    ["pageTitle", {de: "Impressum", en: "Legal Notice / Impressum"}],
    ["pageSubtitle", {de: "Angaben gemäß § 5 DDG", en: "Information in accordance with § 5 DDG"}]
  ]);

</script>