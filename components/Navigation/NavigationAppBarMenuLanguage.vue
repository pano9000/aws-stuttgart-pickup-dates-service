<template>
  <v-menu
    open-on-hover
    eager
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :icon="mdiTranslateVariant"
      />
    </template>

    <v-list>
      <v-list-item
        v-for="language in languages"
        :key="language"
      >
      <template #default>
        <div class="d-flex ga-2 align-center">
          <v-img
            :src="`/img/flag_${language}.svg`"
            min-width="2rem"
            inline
          />
          <span>{{ language }}</span>
        </div>
      </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
  import { mdiTranslateVariant } from "@mdi/js"

const languages = [
  "DE",
  "EN"
]

</script>