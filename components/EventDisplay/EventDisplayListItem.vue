<template>
  <li>
    <v-list-item 
      rounded="lg"
      variant="elevated"
      class="ma-2"
    >
      <template #prepend>
        <v-avatar :color="eventTypeMap.get(props.eventData.type)?.color">
          <v-icon :icon="eventTypeMap.get(props.eventData.type)?.icon"/>
        </v-avatar>
      </template>

      <template #default>
        <div>
          <v-chip>{{ i18n.d(props.eventData.date, "short") }}</v-chip>
          <v-chip>{{ i18n.t(`waste_${props.eventData.type}`) }}</v-chip>
          <v-chip>{{ i18n.t(`schedule_${props.eventData.schedule}`) }}</v-chip>
        </div>
      </template>

    </v-list-item>
  </li>
</template>

<script setup lang="ts">
  import type { AwsApiServiceEventTypeName, AwsApiServiceEventScheduleName } from "~/server/services/AwsApiService";
  import eventTypeMap from "~/utils/eventTypeMap"
  const { i18n } = useCustomI18n();

  const props = defineProps<{ 
    eventData: { 
      type: AwsApiServiceEventTypeName,
      date: string,
      schedule: AwsApiServiceEventScheduleName
    }
  }>();

</script>