<template>
  <v-container
    class="text-center"
  >
    <h1>Stuttgart Trash Pickup Dates Service Tool</h1>
    <p>
      Unofficial utility web page to help with staying on top of the Trash Pickup Dates from Stuttgart's AWS Abfallwirtschaft
    </p>

    <v-row>

      <v-col>
        <v-card title="How to Use">
          <v-card-text>
            Select your address by using the Location Picker above, and then click on one of the cards below
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>

    <v-row justify="center">

      <template v-for="actionCard in actionCards" :key="actionCard[0]">
        <v-col cols="12" md="6" lg="auto">
          <NuxtLink :to="actionCard[0]">
            <v-card :title="actionCard[1]" class="pa-8" color="primary" link>
              <v-card-text class="pa-4">
                <v-icon :icon="actionCard[2]" size="4rem"/>
              </v-card-text>
            </v-card>
          </NuxtLink>
        </v-col>
      </template>
    </v-row>

  </v-container>
</template>

<script setup lang="ts">

  const actionCards: [url: string, title: string, icon: string][] = [
    ["/upcoming", "Show Upcoming Pickups", "mdi-calendar"],
    ["/all", "Show All Pickups", "mdi-calendar-multiselect"],
    ["/icalgenerator", "Generate Custom iCal Link", "mdi-calendar-export"]
  ]


</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>