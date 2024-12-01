<template>
  <BaseExportCustomizer :title="i18n.t('exportCustomizerICal.title')">
    <v-card
      class="my-4 pa-4"
      :title="i18n.t('exportCustomizerICal.pickupEventsTitle')"
      :subtitle="i18n.t('exportCustomizerICal.pickupEventsSubtitle')"
    >
      <v-card-text>
        <v-row>
          <v-col cols="auto">
            <EventTypeSelector v-model="formatOptions.type"/>
          </v-col>
        </v-row>
      </v-card-text>

    </v-card>

    <v-card
      class="my-4 pa-4"
      :title="i18n.t('exportCustomizerICal.eventTimesTitle')"
      :subtitle="i18n.t('exportCustomizerICal.eventTimesSubtitle')"
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
                :icon="mdiClockOutline"
                :disabled="formatOptions.allDay"
              />
            </v-input>
          </v-col>

          <v-col cols="auto" align-self="center">
            <v-divider vertical length="2em" opacity="50"/>
          </v-col>

          <v-col cols="auto">
            <v-checkbox
              v-model="formatOptions.allDay"
              :hide-details="true"
            >
              <template #label>
                <v-icon :icon="mdiHours24"/>
                <span>{{ i18n.t('exportCustomizerICal.labelAllDay') }}</span>
              </template>
            </v-checkbox>
          </v-col>

        </v-row>
      </v-card-text>
    </v-card>

    <v-card
      class="my-4 pa-4"
      :title="i18n.t('exportCustomizerICal.eventAlarmTitle')"
      :subtitle="i18n.t('exportCustomizerICal.eventAlarmSubtitle')"
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
                :icon="mdiBellOutline"
                :label="i18n.t('exportCustomizerICal.labelAlarmMinutesBefore')"
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
              :hide-details="true"
            >
            <template #label>
              <v-icon :icon="mdiBellOffOutline"/>
              <span>{{i18n.t('exportCustomizerICal.labelAlarmDisable')}}</span>
            </template>

            </v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card 
      class="my-4 pa-4"
      :title="i18n.t('exportCustomizerICal.eventOffsetTitle')"
      :subtitle="i18n.t('exportCustomizerICal.eventOffsetSubtitle')"
    >

      <v-card-text>
        <v-row>
          <v-col>
            <v-input class="flex-0-1">
              <NumberInput
                :id="'numberinput__offset'"
                v-model:input-number="formatOptions.offsetEvent"
                :icon="mdiRewindOutline"
                :label="i18n.t('exportCustomizerICal.labelOffsetDaysEarlier')"
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
          :text="i18n.t('exportCustomizerICal.eventOffsetInfo')"
        />
      </v-card-text>
    </v-card>

    <v-card
      class="my-4 pa-4"
      :title="i18n.t('exportCustomizerICal.eventTitleTitle')"
      :subtitle="i18n.t('exportCustomizerICal.eventTitleSubtitle')"
    >
      <v-card-text>
        <v-text-field
          v-model="formatOptions.customSummary"
          :label="i18n.t('exportCustomizerICal.labelEventTitle')"
        />

        <v-text-field
          v-model="eventSummaryPreview"
          :label="i18n.t('exportCustomizerICal.labelEventTitlePreview')"
          :readonly="true"
        />
    
        <v-alert
          color="info"
          icon="$info"
          title="Info"
        >
          <p> {{ i18n.t('exportCustomizerICal.eventTitlePlaceholderInfo') }}</p>
        </v-alert>

      </v-card-text>
    </v-card>

    <v-card
      class="my-4 pa-4"
      :title="i18n.t('exportCustomizerICal.yourIcalLinkTitle')"
    >
      <v-card-text>
        <v-row wrap="nowrap">
          <v-col cols="auto">
            <CopyToClipboardButton :text-to-copy="icalUrl.toString()"/>
            <DownloadButton :download-url="icalUrl.toString()"/>
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
        <v-row>
          <v-col>
            <v-alert type="info">{{ i18n.t("exportCustomizerICal.yourIcalLinkTitleInfo") }}</v-alert>
          </v-col>
        </v-row>

      </v-card-text>
    </v-card>

</BaseExportCustomizer>
</template>

<script setup lang="ts">
  import TimeRangeInput from "~/components/TimeRangeInput.vue";
  import CopyToClipboardButton from "~/components/CopyToClipboardButton.vue";
  import EventTypeSelector from "~/components/EventTypeSelector.vue";
  import BaseExportCustomizer from "./BaseExportCustomizer.vue";
  import { useCookieUserConfig } from "~/composables/useCookieUserConfig";
  import type { ApiDataTransformerICalOptions } from "~/server/services/ApiDataTransformer/ApiDataTransformerICal";
  import type { AwsApiServiceEventTypeName } from "~/server/services/AwsApiService";

  import { 
    mdiClockOutline, 
    mdiHours24, 
    mdiRewindOutline, 
    mdiBellOutline,
    mdiBellOffOutline
  } from "@mdi/js";

  type UiICalFormatOptions = Omit<ApiDataTransformerICalOptions, "startTime" | "endTime" | "translated"> & {
    startTime?: string;
    endTime?: string;
    type?: AwsApiServiceEventTypeName[];
  }

  const { cookieStreet, cookieLanguage } = useCookieUserConfig();
  const { i18n, multiMergeLocaleMessage }  = useCustomI18n();

  multiMergeLocaleMessage("exportCustomizerICal", [
    ["title", {de: "iCalendar-Export", en: "iCalendar Export"}],
    ["pickupEventsTitle", {de: "Abholungen", en: "Collections"}],
    [
      "pickupEventsSubtitle", {
        de: "Wählen Sie die Abholungen, die als Ereignis im Kalender angezeigt werden sollen",
        en: "Select the collections that you want to appear as events in the calendar"
      }
    ],
    ["eventTimesTitle", {de: "Ereignis-Dauer", en: "Event Duration"}],
    [
      "eventTimesSubtitle", {
        de: "Stellen Sie die Start- und Endzeit der Kalender-Einträge ein",
        en: "Set the start and end time of the calendar events"
      }
    ],
    ["labelAllDay", {de: "Ganztätig", en: "Allday"}],
    ["eventAlarmTitle", {de: "Ereignis-Erinnerungen", en: "Event Alarms"}],
    ["eventAlarmSubtitle", {
      de: "Stellen Sie ein, ob und wann der Kalendereintrag eine Erinnerung anzeigen soll",
      en: "Set, if and when the calendar entry should display an alarm notification"
    }],
    ["labelAlarmMinutesBefore", {de: "Minute(n) vorher", en: "minute(s) before"}],
    ["labelAlarmDisable", {de: "Erinnerungen deaktivieren", en: "Disable Alarms"}],
    ["eventOffsetTitle", {de: "Ereignis-Offset", en: "Offset Event"}],
    ["eventOffsetSubtitle", {de: "Stellen Sie ein, ob Sie das Ereignis vor dem Abholungsdatum anzeigen möchten", en: "Set if you want to show the event before the actual collection date"}],
    ["labelOffsetDaysEarlier", {de: "Tag(e) vorher", en: "day(s) earlier"}],
    [
      "eventOffsetInfo", {
      de: "Verwenden Sie diese Einstellung, wenn Sie das Ereignis in Ihrem Kalender bereits vor dem tatsächlichen Abholungsdatum angezeigt haben möchten. Dies kann nützlich sein, um sich bspw. am Abend vorher eine Erinnerung zu setzen, den Müll rechtzeitig bereitzustellen.", 
      en: "Use this option, if you want the event to appear in your calendar before the actual collection date. This can be useful e.g. to set yourself a reminder to put out the trash, the night before the collection happens."}
    ],
    ["eventTitleTitle", {de: "Ereignis-Titel", en: "Event Title"}],
    ["eventTitleSubtitle", {de: "Stellen Sie den Titel ein, wie das Ereignis im Kalender angezeigt werden soll", en: "Set the title that will be shown in the calendar for the event"}],
    ["labelEventTitle", {de: "Ereignis-Titel-Vorlage", en: "Event Title Template"}],
    ["labelEventTitlePreview", {de: "Ereignis-Titel-Vorschau", en: "Event Title Preview"}],
    ["eventTitleDefaultTitle", {de: "Abholung %1 (%2)", en: "%1 Collection (%2)"}],
    [
      "eventTitlePlaceholderInfo", {
        de: "Sie können '%1' (für die Abholungsart) und '%2' (für die Abholfrequenz) als Platzhalter im Titel verwenden.", 
        en: "You can use '%1' (for the collection type) and '%2' (for the collection frequency) as placeholders in the title."
      }
    ],
    ["yourIcalLinkTitle", {de: "Ihr benutzerdefinierter iCalendar-Export", en: "Your Customized iCalendar Export"}],
    ["yourIcalLinkTitleInfo", {
      de: "Laden Sie sich die iCalendar-Datei herunter oder benutzen Sie den Link, um die Abholungen in Ihrem Kalender-Dienst zu importieren und synchronisiert zu halten.", 
      en: "Download the iCalendar-File or use the link to import your the collections into your calender service and keep it synchronized."}],
  ]);

  const formatOptions = ref<UiICalFormatOptions>({
    type: [],
    startTime: "06:30",
    endTime: "06:45",
    alarm: 15,
    allDay: false,
    offsetEvent: 0,
    customSummary: i18n.t("exportCustomizerICal.eventTitleDefaultTitle")
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
      ? formatOptions.value.customSummary?.replaceAll("%1", i18n.t("waste_residual")).replaceAll("%2", i18n.t("schedule_W2"))
      : `${i18n.t("waste_residual")} (${i18n.t("schedule_W2")})`
  });

</script>