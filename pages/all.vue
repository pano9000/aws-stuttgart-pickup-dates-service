<template>
  <BasePageTemplate
    :page-title="i18n.t('all.pageTitle')"
    :page-subtitle="hasSetStreet ? i18n.t('all.pageSubtitle', { address: `${cookieStreet.streetname} ${cookieStreet.streetno}` } ) : undefined"
  >
    <template #mainContent>
      <BaseEventDisplay api-endpoint="/api/v1/all"/>
    </template>
  </BasePageTemplate>

</template>

<script setup lang="ts">
  import BaseEventDisplay from "~/components/EventDisplay/BaseEventDisplay.vue";
  import { useCookieUserConfig } from "~/composables/useCookieUserConfig";

  const { cookieStreet, hasSetStreet } = useCookieUserConfig();
  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  multiMergeLocaleMessage("all", [
    ["pageTitle", {de: "Alle Abholungen", en: "All Collections"}],
    ["pageSubtitle", {de: "Alle geplanten Abholungen für { address }", en: "All scheduled collections for { address }"}],
  ]);

</script>