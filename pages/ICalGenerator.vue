<template>
  <LocationPicker></LocationPicker>

  <h1>Generate Custom iCal Calendar</h1>

  <p>Use the options below to generate a custom iCal Calendar for the Pickup Dates</p>

  <v-card
    class="my-4 pa-4"
    title="Pickup Events"
    subtitle="Select the type of pickups that you want to appear as events in the calendar"
  >

    <v-btn-toggle
      v-model="formatOptions.type"
      multiple
      mandatory
    >
      <v-btn
        v-for="eventType in eventTypeColorTuple" :key="eventType[0]" 
        :value="eventType[0]"
        :color="eventType[1]"
        class="custom-transform-class text-none"
      >
        <CardIcon :event-type="eventType[0]" class="position-relative"></CardIcon>
        <!-- @TODO there must be a more performatn way than the one below / bitmask maybe? -->
        <v-icon
          v-show="formatOptions.type?.includes(eventType[0])"
          icon="mdi-check" 
          class="position-absolute top-0"
        ></v-icon>
        {{ eventType[0] }}
      </v-btn>
    </v-btn-toggle>


    <!--<v-row>
      <div v-for="eventType in ['paper', 'recycle', 'residual', 'organic'] as AwsApiServiceEventTypeName[]">
        <v-checkbox :value="eventType" v-model="formatOptions.type" :hide-details="true">
          <template #label>
            <CardIcon :event-type="eventType"></CardIcon>
            {{ eventType }}
          </template>
        </v-checkbox>
      </div>
    </v-row>
    -->

  </v-card>

  <v-card
    class="my-4 pa-4"
    title="Event Times"
    subtitle="Set the start and end time of the iCal events"
  >
    <v-card-text class="my-2">
      <v-row align="stretch">
        <v-input
          :hide-details="true"
          class="flex-0-1"
        >
          <TimeRangeInput 
            icon="mdi-clock-outline"
            v-model:start-time="formatOptions.startTime"
            v-model:end-time="formatOptions.endTime"
          ></TimeRangeInput>
        </v-input>
        <v-divider vertical class="ms-4" opacity="25"</v-divider>
        <v-checkbox
          label="All Day"
          v-model="formatOptions.allDay"
          :hide-details="true"
        >
          <template v-slot:label>
            <span>All Day</span>
            <v-icon icon="mdi-hours-24"></v-icon>
          </template>
        </v-checkbox>
      </v-row>
    </v-card-text>

  </v-card>

  <v-container>
    <h2>Event Alarm</h2>
    <p>Set if you want to add a alarm notification for the events in minutes</p>
    <v-row>
      <v-input>
          <input 
            type="number"
            min="0"
            max="999999"
            step="15"
            label="Show Alarm Before Event" 
            v-model.lazy="formatOptions.alarm"
            :disabled="disabledAlarm"
          >
      </v-input>

      <v-checkbox label="Disable Alarm" v-model="disabledAlarm"></v-checkbox>
    </v-row>
  </v-container>

  <v-container>
    <h2>Offset Event</h2>
    <p>Set if you want to show the event before the actual pickup day. This can be useful, if you want to use the event as a reminder to bring out the waste the evening before the pickuo happens in the next morning</p>

    <v-input 
          label="Days to Offset by" 
        >
          <input type="number" min="0" max="999" v-model="formatOptions.offsetEvent">
        </v-input>

    <v-alert
      color="info"
      icon="$info"
      title="Info"
      text="Use this, if you want the event to be displayed e.g. the day before the actual pickup happens. This way you can use the calendar event as reminder to put out the trash, the night before the pickup happens."
    >
      <p>slot test</p>
    </v-alert>


  </v-container>

  <v-container>
    <h2>Custom Event Title</h2>
    <p>Set a custom event title, if you want. You can use %1 and %2 as placeholders for the event type and the event schedule frequency.</p>

    <v-text-field 
      label="Custom Summary" 
      v-model="formatOptions.customSummary"
    >
    </v-text-field>
  </v-container>

  <v-card class="ma-4 pa-4">
    <h2>Your custom iCal Link</h2>
    <div class="d-flex ga-4">

      <v-tooltip :text="(!copiedToClipboard) ? 'Copy to Clipboard' : 'Copied'" location="top">
        <template v-slot:activator="{ props }">
          <v-btn 
            :icon="(!copiedToClipboard) ? 'mdi-clipboard-text-outline' : 'mdi-clipboard-check-outline'"
            v-bind="props" 
            @click="() => copyToClipboardHandler(icalUrl.toString())">
          </v-btn>
        </template>
      </v-tooltip>
  
      <v-text-field
        class="h-25"
        v-model="icalUrl"
        :editable="false"
        :readonly="true"
      >
      </v-text-field>
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import CardIcon from "~/components/CardIcon.vue";
  import { useCookieUserConfig } from "~/composables/useCookieUserConfig";
  import { useCopyToClipboard } from "~/composables/useCopyToClipboard";
  import type { ICalOptions } from "~/server/services/TransformDataService";
  import type { AwsApiServiceEventTypeName } from "~/server/services/AwsApiService";
  
  type UiICalFormatOptions = Omit<ICalOptions, "startTime" | "endTime" | "translated"> & {
    startTime?: string;
    endTime?: string;
    type?: AwsApiServiceEventTypeName[];
  }

  const { cookieStreet, cookieLanguage } = useCookieUserConfig();
  const { copiedToClipboard, copyToClipboardHandler } = useCopyToClipboard();

  const formatOptions = ref<UiICalFormatOptions>({
    type: [],
    startTime: "06:30",
    endTime: "07:00",
    alarm: 15,
    allDay: false,
    offsetEvent: 0,
    customSummary: "Pickup %1 (%2)"
  });

  const disabledAlarm = ref<boolean>(false);

  const apiUrl = (() => {
    const url = useRequestURL();
    url.pathname = "/api/v1/all";
    return url;
  })();

  const icalUrl = computed( () => {
    const urlParams = new URLSearchParams([
      ["streetname", cookieStreet.value.streetname],
      ["streetno", cookieStreet.value.streetno],
      ["format", "ical"],
      ["translate", cookieLanguage.value || "de"],
    ]);

    const optionalParams: [queryParam: string, queryValue: string | boolean | number | undefined][] = [
      ["startTime", formatOptions.value.startTime],
      ["endTime", formatOptions.value.endTime],
      ["allDay", formatOptions.value.allDay],
      ["alarm", (disabledAlarm.value) ? undefined : formatOptions.value.alarm || 0 * 60],
      ["offsetEvent", formatOptions.value.offsetEvent],
      ["customSummary", formatOptions.value.customSummary],
      ["type", formatOptions.value.type?.join(",")]
    ];

    optionalParams.forEach(queryParamTuple => {
      if (queryParamTuple[1]) {
        urlParams.append(queryParamTuple[0], queryParamTuple[1].toString())
      }
    });

    apiUrl.search = urlParams.toString();
    return apiUrl.toString();
  })

  const eventTypeColorTuple: [eventType: AwsApiServiceEventTypeName, color: string][] = [
    ["paper", "#6B975E"], //
    ["recycle", "#F3C200"],
    ["residual", "black"], // AWS uses #3C4146
    ["organic", "brown"] // AWS used #8D6146
  ];

  //workaround due to some hydration mismatch issue in vuetify, when setting the values server side already
  onMounted( () => {
    formatOptions.value.type = eventTypeColorTuple.map(eventType => eventType[0])
  })

</script>