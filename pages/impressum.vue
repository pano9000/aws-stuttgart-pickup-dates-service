<template>

  <BasePageTemplate :page-title="i18n.t('legalNotice.pageTitle')">
    <template #mainContent>
      <address class="text-left">
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
    ["pageTitle", {de: "Impressum", en: "Legal Notice"}],
  ]);

</script>