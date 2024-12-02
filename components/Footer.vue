<template>
  <v-footer 
    color="secondary"
    class="elevation-8 flex-0-1"
  >
  <v-container>
    <v-row  class="text-center">
      <v-spacer cols="3"/>
      <v-col cols="6">
        <div><NuxtLink to="impressum" class="nuxtlink">{{ i18n.t('legalNotice.pageTitle') }}</NuxtLink></div>
        <small>2024 — Panagiotis Papadopoulos (@pano9000)</small>
      </v-col>
      <v-col cols="3">
        <v-tooltip
          :text="i18n.t('footer.checkSource')"
        >
          <template #activator="{ props }">
            <a
                :href="runtimeConfig.public.projectGitUrl"
                target="_blank"
              v-bind="props"
            >
              <v-icon :icon="mdiGithub"/>
            </a>
            </template>
        </v-tooltip>

      </v-col>
    </v-row>
  </v-container>

  </v-footer>
</template>

<script setup lang="ts">
import { mdiGithub } from '@mdi/js';
const runtimeConfig = useRuntimeConfig();

const {i18n, multiMergeLocaleMessage} = useCustomI18n();

multiMergeLocaleMessage("footer", [
  ["checkSource", {de: "Quellcode auf GitHub einsehen", en: "Check Source Code on GitHub"}]
])
</script>