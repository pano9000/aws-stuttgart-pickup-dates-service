<template>
  <WarnNoSetStreet/>
  <v-container v-if="props.eventData">
    <v-data-iterator
      :items="props.eventData.data"
      :page="currPage"
      :items-per-page="12"
      :loading="props.isLoading"
    >

      <template #header>
        <v-toolbar class="px-2">
          <div>header</div>
        </v-toolbar>
      </template>

      <template #loader>
        <v-container>

          <v-row>
            <v-col v-for="i in 3" :key="i">
              <v-skeleton-loader
                class="border"
                type="image, heading"
              />
            </v-col>
          </v-row>
        </v-container>

      </template>

      <template #default="{ items }">
        <v-container class="bg-grey-lighten-5 rounded-b-lg elevation-2" >

          <v-row v-if="props.displayMode === 'grid'">
            <template
              v-for="event in items"
              :key="`${event.raw.date}_${event.raw.type}_${event.raw.schedule}`"
            >
              <v-col cols="4">
                <EventCard
                  :event-data=event.raw
                />
              </v-col>

            </template>
          </v-row>

          <ol v-else-if="props.displayMode === 'list'" style="list-style: none;">
            <EventList
              v-for="event in items"
              :key="`${event.raw.date}_${event.raw.type}_${event.raw.schedule}`"
              :event-data=event.raw
            />
          </ol>

          <ol v-else-if="props.displayMode === 'calendar'" style="list-style: none;">
            <v-alert>Calendar view #TODO</v-alert>
          </ol>

        </v-container>

      </template>

      <template #footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-4">
          <v-btn
            :disabled="page === 1"
            density="comfortable"
            :icon="mdiArrowLeft"
            variant="tonal"
            rounded
            @click="prevPage"
          />

          <div class="mx-2 text-caption">
            Page {{ page }} of {{ pageCount }}
          </div>

          <v-btn
            :disabled="page >= pageCount"
            density="comfortable"
            :icon="mdiArrowRight"
            variant="tonal"
            rounded
            @click="nextPage"
          />
        </div>
      </template>

    </v-data-iterator>

  </v-container>
  <v-container v-else>
    <v-alert 
      type="error"
      title="Uh oh! An Unexpected Error Ocurred."
      text="Please check your address and try again later or kindly report the issue."
    />
  </v-container>

</template>

<script setup lang="ts">
  import type { AwsApiServiceResponseAll } from "~/server/services/AwsApiService.js"
  import EventCard from "../EventCard.vue";
  import WarnNoSetStreet from "../WarnNoSetStreet.vue";
  import { mdiArrowRight, mdiArrowLeft } from "@mdi/js";

  const currPage = ref(1);
  const props = defineProps<{ 
    eventData: AwsApiServiceResponseAll | null;
    isLoading: boolean;
    displayMode: "grid" | "list" | "calendar" | undefined;
  }>();
  //const { cookieStreet, hasSetStreet } = useCookieUserConfig();

</script>