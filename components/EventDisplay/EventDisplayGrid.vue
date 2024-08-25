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
            <v-col
              v-for="(_, k) in 3"
              :key="k"
            >
              <v-skeleton-loader
                class="border"
                type="image, heading"
              />
            </v-col>
          </v-row>
        </v-container>

      </template>

      <template #default="{ items }">
        <v-container>
          <v-row>
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

        </v-container>

      </template>

      <template #footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-4">
          <v-btn
            :disabled="page === 1"
            density="comfortable"
            icon="mdi-arrow-left"
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
            icon="mdi-arrow-right"
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

  const currPage = ref(1);
  const props = defineProps<{ 
    eventData: AwsApiServiceResponseAll | null;
    isLoading: boolean
  }>();
  //const { cookieStreet, hasSetStreet } = useCookieUserConfig();

</script>