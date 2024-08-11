<template>
  <LocationPicker></LocationPicker>

  <v-container>
  <h1 class="text-h3 text-center">Generate Custom iCal Calendar</h1>

  <p>Use the options below to generate a custom iCal Calendar for the Pickup Dates</p>

  <v-card
    class="my-4 pa-4"
    title="Pickup Events"
    subtitle="Select the type of pickups that you want to appear as events in the calendar"
  >
    <v-card-text>
      <v-row>
        <v-col cols="auto">
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
        </v-col>
      </v-row>
    </v-card-text>

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

  <v-card
    class="my-4 pa-4"
    title="Event Alarm"
    subtitle="Set an alarm notification before for the event"
  >
    <v-card-text>
      <v-row>
        <v-col cols="auto">
          <v-input 
            class="flex-0-1"
            :hide-details="true"
          >
            <NumberInput
              icon="mdi-bell-outline"
              id="numberinput__alarm"
              label="minute(s) before"
              :min=0
              :max=720
              :step=5
              :disabled="disabledAlarm"
              v-model:input-number="formatOptions.alarm"
            >
            </NumberInput>
          </v-input>
        </v-col>

        <v-col cols="auto" align-self="center">
          <v-divider vertical length="2em" opacity="50"></v-divider>
        </v-col>

        <v-col cols="auto">
          <v-checkbox
            label="Disable Alarm"
            v-model="disabledAlarm"
            :hide-details="true"
          >
          <template v-slot:label>
            <v-icon icon="mdi-bell-off-outline"></v-icon>
            <span>Disable Alarm</span>
          </template>

          </v-checkbox>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card 
    class="my-4 pa-4"
    title="Offset Event"
    subtitle="Set if you want to show the event before the actual pickup day"
  >

    <v-card-text>
      <v-row>
        <v-col>
          <v-input class="flex-0-1">
            <NumberInput
              icon="mdi-rewind-outline"
              :id="'numberinput__offset'"
              :label="'day(s) earlier'"
              :min=0
              :max=7
              v-model:input-number="formatOptions.offsetEvent"
            >
            </NumberInput>
          </v-input>
        </v-col>
      </v-row>

      <v-alert
        color="info"
        icon="$info"
        title="Info"
        text="Use this, if you want the event to appear in your calendar before the actual pickup happens. This way you can use the calendar event as reminder to put out the trash, e.g. the night before the pickup happens."
      >
      </v-alert>
    </v-card-text>
  </v-card>

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
</v-container>
</template>

<script setup lang="ts">
  import CardIcon from "~/components/CardIcon.vue";
  import TimeRangeInput from "~/components/TimeRangeInput.vue";
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