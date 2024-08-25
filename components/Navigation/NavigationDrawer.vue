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
    ["home", {de: "Start", en: "Home"}],
    ["upcomingPickups", {de: "Bevorstehende Abholungen", en: "Upcoming Pickups"}],
    ["allPickups", {de: "Alle Abholungen", en: "All Pickups"}],
    ["icalGenerator", {de: "iCal-Generator", en: "iCal Generator"}],
  ]) 

  const items = ref<[path: string, name: string][]>([
    ["/",             "navigationDrawer.home"],
    ["upcoming",      "navigationDrawer.upcomingPickups"],
    ["all",           "navigationDrawer.allPickups"],
    ["icalgenerator", "navigationDrawer.icalGenerator"]
  ])

</script>