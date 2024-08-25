<template>

<v-container v-if="props.eventData">
    <v-data-iterator
      :items="props.eventData.data"
      :page="currPage"
      :items-per-page="12"
      :loading="props.isLoading"
    >

      <template #header>
        <v-toolbar class="px-2">
          <div>header list</div>
        </v-toolbar>
      </template>

      <template #loader>
        <v-container>

          <v-row>
            <v-col>
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
          <ol style="list-style: none;">
            <EventList
              v-for="event in items"
              :key="`${event.raw.date}_${event.raw.type}_${event.raw.schedule}`"
              :event-data=event.raw
              />
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

</template>

<script setup lang="ts">
  import type { AwsApiServiceResponseAll } from "~/server/services/AwsApiService.js"
  import { mdiArrowRight, mdiArrowLeft } from "@mdi/js";
  const currPage = ref(1);

  const props = defineProps<{ 
    eventData: AwsApiServiceResponseAll | null;
    isLoading: boolean
  }>();
</script>