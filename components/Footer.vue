<template>
  <v-footer 
    color="secondary"
    class="elevation-8 flex-0-1"
  >
  <v-container>
    <v-row  class="text-center">
      <v-spacer cols="3"/>
      <v-col cols="6">
        2024 — Panagiotis Papadopoulos (@pano9000)
      </v-col>
      <v-col cols="3">
        <v-tooltip
          :text="'Check Sourcecode on GitHub'"
        >
          <template #activator="{ props }">
            <a
              href="https://github.com/pano9000/aws-stuttgart-pickup-dates-service"
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
</script>