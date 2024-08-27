<template>
  <v-btn-toggle
    v-model="modelSelectedEvents"
    multiple
    mandatory
  >
    <v-btn
      v-for="eventType in eventTypeMap.entries()" :key="eventType[0]" 
      :value="eventType[0]"
      :color="eventType[1].color"
      class="custom-transform-class text-none"
    >
      <v-icon :icon="eventType[1].icon" size="2rem"/>
      <!-- @TODO there must be a more performatn way than the one below / bitmask maybe? -->
      <v-icon
        v-show="modelSelectedEvents?.includes(eventType[0])"
        :icon="mdiCheck" 
        class="position-absolute top-0 right-0"
      />
        {{ props.showLabel ? i18n.t(`waste_${eventType[0]}`) : undefined }}
    </v-btn>
  </v-btn-toggle>
</template>

<script setup lang="ts">
  import eventTypeMap from "~/utils/eventTypeMap";
  import { mdiCheck } from "@mdi/js";
  import type { AwsApiServiceEventTypeName } from "~/server/services/AwsApiService";

  const modelSelectedEvents = defineModel<AwsApiServiceEventTypeName[]>({default: []});
  const props = defineProps<{
    showLabel?: boolean;
  }>();
  const { i18n } = useCustomI18n();


  //workaround due to some hydration mismatch issue in vuetify, when setting the values server side already
  onMounted( () => {
    modelSelectedEvents.value = Array.from(eventTypeMap.keys())
  })

</script>