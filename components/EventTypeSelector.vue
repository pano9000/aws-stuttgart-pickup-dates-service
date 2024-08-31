<template>
  <v-btn-toggle
    v-model="modelSelectedEvents"
    multiple
    mandatory
  >
    <BaseToolTipButton 
      v-for="eventType in eventTypeMap.entries()" :key="eventType[0]" 
      v-slot="tooltipActivator"
      :tooltip-title="i18n.t(`waste_${eventType[0]}`)"
    >
      <v-btn
        v-bind="tooltipActivator"
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
      </v-btn>
    </BaseToolTipButton>
  </v-btn-toggle>
</template>

<script setup lang="ts">
  import eventTypeMap from "~/utils/eventTypeMap";
  import { mdiCheck } from "@mdi/js";
  import type { AwsApiServiceEventTypeName } from "~/server/services/AwsApiService";

  const { i18n } = useCustomI18n();
  const { cookieEventTypeSelector } = useCookieUserConfig();

  const modelSelectedEvents = defineModel<AwsApiServiceEventTypeName[]>({default: []});

  modelSelectedEvents.value = cookieEventTypeSelector.value || Array.from(eventTypeMap.keys());

  watch(modelSelectedEvents, (value) => {
    if (value) cookieEventTypeSelector.value = value
  });

  //@TODO change logic of the filter, so that empty means all, and we only collect the events we don't want to display

</script>