<template>
  <v-container>
    <v-data-iterator
      :items="filteredEventsByType"
      :page="currPage"
      :items-per-page="eventsPerPage"
      :loading="props.isLoading"
      >

      <template #header>
        <v-toolbar class="px-4 elevation-2 ">
          <div class="d-flex ga-2 w-100  justify-space-between">
            <div class="d-flex ga-2">
              <EventDisplayTypeFilterMenu v-model="selectedEventTypes"/>
              <EventDisplayExportAsMenu :api-endpoint="props.apiEndpoint"/>
            </div>
            <EventDisplayModeSelector/>

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
        <v-container class="bg-grey-lighten-5 rounded-b-lg elevation-2">
          <v-row v-if="!displayMode || displayMode === 'grid'">
            <template
              v-for="event in items"
              :key="`${event.raw.date}_${event.raw.type}_${event.raw.schedule}`"
            >
              <v-col sm="auto" md="4" lg="3">
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

      <template #no-data>
        <v-container class="bg-grey-lighten-5 rounded-b-lg elevation-2">
          <WarnNoSetStreet/>
          <v-alert
            v-if="hasSetStreet"
            type="info"
            :title="i18n.t('baseEventDisplay.fetchNoDataTitle')"
            :text="i18n.t('baseEventDisplay.fetchNoDataText')"
          />
        </v-container>
      </template>


      <template v-if="props.hidePagination !== true" #footer="{ page, pageCount, prevPage, nextPage }">
        <v-row>
          <v-col>
            <v-spacer/>
          </v-col>
          <v-col>
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
            {{ i18n.t('baseEventDisplay.paginationIndicator', {pageCurr: page, pageTotal: pageCount}) }}
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
          </v-col>
          <v-col>
            <EventDisplayItemsPerPageSelector
              v-model="eventsPerPage"
              :items="[6, 12, 18, 24, 30]"
            />
          </v-col>
      </v-row>

      </template>

    </v-data-iterator>

  </v-container>
</template>

<script setup lang="ts">
  import type { AwsApiServiceEventTypeName, AwsApiServiceResponseAll } from "~/server/services/AwsApiService.js"
  import EventDisplayCard from "./EventDisplayCard.vue";
  import EventDisplayListItem from "./EventDisplayListItem.vue";
  import WarnNoSetStreet from "../WarnNoSetStreet.vue";
  import { mdiArrowRight, mdiArrowLeft } from "@mdi/js";
  import EventDisplayModeSelector from "./EventDisplayModeSelector.vue";
  import EventDisplayTypeFilterMenu from "./EventDisplayTypeFilterMenu.vue";
  import EventDisplayItemsPerPageSelector from "./EventDisplayItemsPerPageSelector.vue";
  import EventDisplayExportAsMenu from "./EventDisplayExportAsMenu.vue";

  const { cookieEventDisplayMode: displayMode, hasSetStreet } = useCookieUserConfig();
  const { i18n, multiMergeLocaleMessage } = useCustomI18n();

  const eventsPerPage = ref<number>();
  const currPage = ref<number>(1);
  const selectedEventTypes = ref<AwsApiServiceEventTypeName[]>();

  const props = defineProps<{ 
    eventData: AwsApiServiceResponseAll | null;
    isLoading: boolean;
    apiEndpoint: string;
    hidePagination?: boolean;
  }>();

  const filteredEventsByType = computed( () => {
    return props.eventData?.data.filter( entry => selectedEventTypes.value?.includes(entry.type)) || []
  })

  //workaround due to some hydration mismatch issue in vuetify, when setting the values server side already
  onMounted( () => {
    selectedEventTypes.value = Array.from(eventTypeMap.keys())
  })

  multiMergeLocaleMessage("baseEventDisplay", [
    [ "fetchNoDataTitle", {"de": "Es gibt nichts zu sehen", "en": "Nothing to see here"} ],
    [
      "fetchNoDataText", {
        "de": "Es sieht so aus, als wenn es keine Daten zum Anzeigen gibt.",
        "en": "It looks like there is no data to display."
      }
    ],
    [ "paginationIndicator", {
      "de": "Seite {pageCurr} von {pageTotal}",
      "en": "Page {pageCurr} of {pageTotal}"
    }]
  ])

</script>