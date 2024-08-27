<template>
  <WarnNoSetStreet/>
  <v-container v-if="props.eventData">
    <v-data-iterator
      :items="filteredEventsByType"
      :page="currPage"
      :items-per-page="12"
      :loading="props.isLoading"
    >

      <template #header>
        <v-toolbar class="px-4 elevation-2">
          <div>
            <div class="text-center">Display Mode</div>
            <EventDisplayModeSelector/>
          </div>
          <v-spacer></v-spacer>
          <div>
            <div class="text-center">Type Filter</div>
            <EventTypeSelector v-model="selectedEventTypes"/>
          </div>
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

          <v-row v-if="!displayMode || displayMode === 'grid'">
            <template
              v-for="event in items"
              :key="`${event.raw.date}_${event.raw.type}_${event.raw.schedule}`"
            >
              <v-col cols="4">
                <EventDisplayCard
                  :event-data=event.raw
                />
              </v-col>

            </template>
          </v-row>

          <ol v-else-if="displayMode === 'list'" style="list-style: none;">
            <EventDisplayListItem
              v-for="event in items"
              :key="`${event.raw.date}_${event.raw.type}_${event.raw.schedule}`"
              :event-data=event.raw
            />
          </ol>

          <ol v-else-if="displayMode === 'calendar'" style="list-style: none;">
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
  import type { AwsApiServiceEventTypeName, AwsApiServiceResponseAll } from "~/server/services/AwsApiService.js"
  import EventDisplayCard from "./EventDisplayCard.vue";
  import EventDisplayListItem from "./EventDisplayListItem.vue";
  import WarnNoSetStreet from "../WarnNoSetStreet.vue";
  import { mdiArrowRight, mdiArrowLeft } from "@mdi/js";
  import EventDisplayModeSelector from "./EventDisplayModeSelector.vue";
import EventTypeSelector from "../EventTypeSelector.vue";
  import { eventTypeMap } from "#imports";
  const { eventDisplayMode: displayMode } = useCookieUserConfig();

  const currPage = ref(1);
  const props = defineProps<{ 
    eventData: AwsApiServiceResponseAll | null;
    isLoading: boolean;
  }>();
  //const { cookieStreet, hasSetStreet } = useCookieUserConfig();

  const selectedEventTypes = ref<AwsApiServiceEventTypeName[]>();

  const filteredEventsByType = computed( () => {
    return props.eventData?.data.filter( entry => selectedEventTypes.value?.includes(entry.type)) || []
  })

  //workaround due to some hydration mismatch issue in vuetify, when setting the values server side already
  onMounted( () => {
    selectedEventTypes.value = Array.from(eventTypeMap.keys())
  })

</script>