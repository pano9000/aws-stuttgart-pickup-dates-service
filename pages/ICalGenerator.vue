<template>
  <LocationPicker></LocationPicker>

  <h1>Generate Custom iCal Calendar</h1>

  <v-container>
    <h2>Type of Pickups</h2>
    <p>Select the type of pickups that should appear in your iCal</p>
    <v-row>
      <div v-for="eventType in ['recycle', 'paper', 'residual', 'organic'] as AwsApiServiceEventTypeName[]">
        <v-checkbox :value="eventType" v-model="formatOptions.type">
          <template #label>
            <CardIcon :event-type="eventType"></CardIcon>
            {{ eventType }}
          </template>
        </v-checkbox>
      </div>
    </v-row>

  <v-card class="ma-4 pa-4">
    <h2>Event Times</h2>
    <p>Set the start and end time of the iCal event, and how you want it to display</p>
    <div class="d-flex">
      <TimeRangeInput 
        icon="mdi-clock-outline"
        v-model:start-time="formatOptions.startTime"
        v-model:end-time="formatOptions.endTime"
      ></TimeRangeInput>

      <v-checkbox
        label="All Day"
        v-model="formatOptions.allDay"
        :hide-details="true"
      >
      </v-checkbox>
    </div>

  
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
            @click="copyToClipboardHandler">
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
  import { useCookieUserConfig } from "~/components/useCookieUserConfig";
  import type { ICalOptions } from "~/server/services/TransformDataService";
  const { cookieStreet, cookieLanguage } = useCookieUserConfig();
  import type { AwsApiServiceEventTypeName } from "~/server/services/AwsApiService";

  type UiICalFormatOptions = Omit<ICalOptions, "startTime" | "endTime" | "translated"> & {
    startTime?: string;
    endTime?: string;
    type?: AwsApiServiceEventTypeName[];
  }

  const formatOptions = ref<UiICalFormatOptions>({
    type: ["residual","organic","paper","recycle"],
    startTime: "06:30",
    endTime: "07:00",
    alarm: 15,
    allDay: false,
    offsetEvent: 0,
    customSummary: ""
  });

  const disabledAlarm = ref<boolean>(false);
  const copiedToClipboard = ref<boolean>(false);



  const icalUrl = computed( () => {
    const urlParams = new URLSearchParams([
      ["streetname", cookieStreet.value.streetname],
      ["streetno", cookieStreet.value.streetno],
      ["format", "ical"],
      ["translate", cookieLanguage.value || "de"],
    ]);

    const a: [queryParam: string, queryValue: string | boolean | number | undefined][] = [
      ["startTime", formatOptions.value.startTime],
      ["endTime", formatOptions.value.endTime],
      ["allDay", formatOptions.value.allDay],
      ["alarm", (disabledAlarm.value) ? undefined : formatOptions.value.alarm || 0 * 60],
      ["offsetEvent", formatOptions.value.offsetEvent],
      ["customSummary", formatOptions.value.customSummary],
      ["type", formatOptions.value.type?.join(",")]
    ]
    a.forEach(queryParamTuple => {
      if (queryParamTuple[1]) {
        urlParams.append(queryParamTuple[0], queryParamTuple[1].toString())
      }
    })
    //urlParams.append("customSummary", formatOptions.value.customSummary as string)
    return urlParams
  })


  function copyToClipboardHandler() {
    copiedToClipboard.value = true;
    navigator.clipboard.writeText(icalUrl.value.toString());
    setTimeout( () => copiedToClipboard.value = false, 1000)
  }


</script>