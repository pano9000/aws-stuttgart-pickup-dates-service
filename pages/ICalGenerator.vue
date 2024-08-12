<template>
  <div>
  <LocationPicker/>
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
              <CardIcon :event-type="eventType[0]" class="position-relative"/>
              <!-- @TODO there must be a more performatn way than the one below / bitmask maybe? -->
              <v-icon
                v-show="formatOptions.type?.includes(eventType[0])"
                icon="mdi-check" 
                class="position-absolute top-0"
              />
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
      <v-row>
        <v-col cols="auto">
          <v-input
            :hide-details="true"
            class="flex-0-1"
          >
            <TimeRangeInput 
              v-model:start-time="formatOptions.startTime"
              v-model:end-time="formatOptions.endTime"
              icon="mdi-clock-outline"
            />
          </v-input>
        </v-col>

        <v-col cols="auto" align-self="center">
          <v-divider vertical length="2em" opacity="50"/>
        </v-col>

        <v-col cols="auto">
          <v-checkbox
            v-model="formatOptions.allDay"
            label="All Day"
            :hide-details="true"
          >
            <template #label>
              <v-icon icon="mdi-hours-24"/>
              <span>All Day</span>
            </template>
          </v-checkbox>
        </v-col>

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
              id="numberinput__alarm"
              v-model:input-number="formatOptions.alarm"
              icon="mdi-bell-outline"
              label="minute(s) before"
              :min=0
              :max=720
              :step=5
              :disabled="disabledAlarm"
            />
          </v-input>
        </v-col>

        <v-col cols="auto" align-self="center">
          <v-divider vertical length="2em" opacity="50"/>
        </v-col>

        <v-col cols="auto">
          <v-checkbox
            v-model="disabledAlarm"
            label="Disable Alarm"
            :hide-details="true"
          >
          <template #label>
            <v-icon icon="mdi-bell-off-outline"/>
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
              :id="'numberinput__offset'"
              v-model:input-number="formatOptions.offsetEvent"
              icon="mdi-rewind-outline"
              :label="'day(s) earlier'"
              :min=0
              :max=7
            />
          </v-input>
        </v-col>
      </v-row>

      <v-alert
        color="info"
        icon="$info"
        title="Info"
        text="Use this, if you want the event to appear in your calendar before the actual pickup happens. This way you can use the calendar event as reminder to put out the trash, e.g. the night before the pickup happens."
      />
    </v-card-text>
  </v-card>

  <v-card
    class="my-4 pa-4"
    title="Event Title"
    subtitle="Set the event title"
  >
    <v-card-text>
      <v-text-field
        v-model="formatOptions.customSummary"
        label="Event Title"
      />

      <v-text-field
        v-model="eventSummaryPreview"
        label="Event Title Preview"
        :readonly="true"
      />
  
      <v-alert
        color="info"
        icon="$info"
        title="Info"
      >
        <p>You can use %1 and %2 as placeholders for the event type and the event schedule frequency.</p>
      </v-alert>

    </v-card-text>
  </v-card>

  <v-card
    class="my-4 pa-4"
    title="Your custom iCal Link"
  >
    <v-card-text>
      <v-row wrap="nowrap">
        <v-col cols="auto">
          <v-tooltip :text="(!copiedToClipboard) ? 'Copy to Clipboard' : 'Copied'" location="top">
            <template #activator="{ props }">
              <v-btn 
                :icon="(!copiedToClipboard) ? 'mdi-clipboard-text-outline' : 'mdi-clipboard-check-outline'"
                v-bind="props" 
                @click="() => copyToClipboardHandler(icalUrl.toString())"
              />
            </template>
          </v-tooltip>
        </v-col>
        <v-col>
          <v-text-field
            v-model="icalUrl"
            class="h-25"
            :editable="false"
            :readonly="true"
            :hide-details="true"
          />
        </v-col>

      </v-row>

    </v-card-text>
  </v-card>

</v-container>
</div>

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

    const localApiUrl = apiUrl;

    localApiUrl.search = urlParams.toString();
    return localApiUrl.toString();
  })


  const eventSummaryPreview = computed( () => {
    return (formatOptions.value.customSummary && formatOptions.value.customSummary?.length > 0) 
      ? formatOptions.value.customSummary?.replaceAll("%1", "Recycleable Waste").replaceAll("%2", "bi-weekly")
      : "Pickup Recycleable Waste (bi-weekly)"
  });

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