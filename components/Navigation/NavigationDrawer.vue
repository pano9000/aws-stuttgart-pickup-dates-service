<template>
  <v-navigation-drawer
    v-model="model"
    temporary
  >
    <v-list>
      <template v-for="item in items" :key="item[0]">
        <NuxtLink :to="item[0]" class="nuxtlink">
          <v-list-item link :title="i18n.t(item[1])"/>
        </NuxtLink>
      </template>
    </v-list>

  </v-navigation-drawer>
</template>

<script setup lang="ts">
  const model = defineModel<boolean>("active");
  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  multiMergeLocaleMessage("navigationDrawer", [
    ["home",                {de: "Start", en: "Home"}],
    ["upcomingCollections", {de: "Nächste Abfuhr", en: "Upcoming Collections"}],
    ["allCollections",      {de: "Alle Abfuhren", en: "All Collections"}],
  ]);

  const items = ref<[path: string, name: string][]>([
    ["/",             "navigationDrawer.home"],
    ["upcoming",      "navigationDrawer.upcomingCollections"],
    ["all",           "navigationDrawer.allCollections"],
  ])

</script>