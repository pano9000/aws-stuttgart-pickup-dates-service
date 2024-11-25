<template>
  <v-menu
    open-on-hover
    eager
  >
    <template #activator="{ props }">
      <div v-bind="props">
        <v-btn :prepend-icon="mdiTranslateVariant">
          <v-chip variant="elevated">
          <template #prepend>
            <v-img
              :src="`/img/flag_${cookieLanguage}.svg`"
              min-width="1.5rem"
              inline
            />
          </template>
          <template #default>
            <span class="mx-2">
              {{ cookieLanguage }}
            </span>
          </template>
          </v-chip>
        </v-btn>
      </div>
    </template>

    <v-list>
      <v-list-item
        v-for="language in i18n.availableLocales"
        :key="language"
        @click="setLanguage(language)"
      >
      <template #default>
        <div class="d-flex ga-2 align-center">
          <v-img
            :src="`/img/flag_${language}.svg`"
            min-width="2rem"
            inline
          />
          <span>{{ language.toUpperCase() }}</span>
        </div>
      </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
  import { mdiTranslateVariant } from "@mdi/js"

 // using setLocale in the click event aboveseems to be causing
 // a full refetch of apiData with useFetch -> 
 // instead set the local.value directly like above to avoid this
 const i18n = useI18n();
 const { cookieLanguage } = useCookieUserConfig();

 i18n.locale.value = cookieLanguage.value;

 function setLanguage(localeCode: string) {
   cookieLanguage.value = localeCode;
   i18n.locale.value = localeCode;
 }
</script>