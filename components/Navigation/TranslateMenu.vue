<template>
   <v-menu
      open-on-hover
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon="mdi-translate-variant"
        />
      </template>

      <v-list>
        <v-list-item
          v-for="language in languages"
          :key="language"
        >
          <!-- <v-btn>{{ language }}</v-btn> -->
           {{ language }}
        </v-list-item>
      </v-list>
    </v-menu>
</template>

<script setup lang="ts">

const languages = [
  "DE",
  "EN"
]

</script>