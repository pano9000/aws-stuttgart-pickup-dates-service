<template>
  <v-navigation-drawer
    v-model="model"
    temporary
  >
    <v-list>
      <template v-for="item in items" :key="item[0]">
        <NuxtLink :to="item[0]" class="nuxtlink">
          <v-list-item link :title="item[1]"/>
        </NuxtLink>
      </template>
    </v-list>

  </v-navigation-drawer>
</template>

<script setup lang="ts">
  const model = defineModel<boolean>("active");

  const items = ref<[path: string, name: string][]>([
    ["/","Home"],
    ["upcoming","Upcoming Pickups"],
    ["all", "All Pickups"],
    ["icalgenerator","iCal Generator"]
  ])

</script>