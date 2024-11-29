<template>
  <BasePageTemplate 
    :page-title="i18n.t('upcoming.pageTitle')"
    :page-subtitle="hasSetStreet ? i18n.t('upcoming.pageSubtitle', { address: `${cookieStreet.streetname} ${cookieStreet.streetno}` } ) : undefined"
  >
    <template #mainContent>
      <BaseEventDisplay
        api-endpoint="/api/v1/upcoming"
        :hide-pagination="true"
      />
    </template>
  </BasePageTemplate>

</template>

<script setup lang="ts">
  import BaseEventDisplay from "~/components/EventDisplay/BaseEventDisplay.vue";
  import { useCookieUserConfig } from "~/composables/useCookieUserConfig";

  const { cookieStreet, hasSetStreet } = useCookieUserConfig();

  const { i18n, multiMergeLocaleMessage }  = useCustomI18n();

  multiMergeLocaleMessage("upcoming", [
    ["pageTitle", {de: "Nächste Abholung", en: "Next Collection"}],
    ["pageSubtitle", {de: "Die bevorstehende Abholungen für { address }", en: "The next upcoming collections for { address }"}],
  ]);

</script>