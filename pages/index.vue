<template>
  <v-container
    class="text-center"
  >
    <h1>{{ i18n.t("pageHome.pageTitle") }}</h1>
    <p>{{ i18n.t("pageHome.pageSubtitle") }}</p>

    <v-row>

      <v-col>
        <v-card :title="i18n.t('pageHome.cardTitleHowToUse')">
          <v-card-text>
            {{ i18n.t('pageHome.cardTextHowToUse') }}
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>

    <v-row justify="center">

      <template v-for="actionCard in actionCards" :key="actionCard[0]">
        <v-col cols="12" md="6" lg="auto">
          <NuxtLink :to="actionCard[0]" class="nuxtlink">
            <v-card :title="i18n.t(actionCard[1])" class="pa-8" color="primary" link>
              <v-card-text class="pa-4">
                <v-icon :icon="actionCard[2]" size="4rem"/>
              </v-card-text>
            </v-card>
          </NuxtLink>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { mdiCalendar, mdiCalendarMultiselect, mdiCalendarExport } from '@mdi/js';
  const { i18n, multiMergeLocaleMessage } = useCustomI18n();
  
  multiMergeLocaleMessage("pageHome", [
    //@TODO: fix this mess of a title
    ["pageTitle", {de: "Stuttgart Müll-Abholtermine-Tool", en: "Stuttgart Trash Pickup Dates Service Tool"}],
    [
      "pageSubtitle", {
        de: "Inoffizielle Hilfswebsite, die Ihnen helfen soll, um die Müll-Abholtermine von Stuttgart's AWS Abfallwirtschaft im Überblick zu behalten", 
        en: "Unofficial utility web page to help with staying on top of the Trash Pickup Dates from Stuttgart's AWS Abfallwirtschaft"
      }
    ],
    ["cardTitleHowToUse", {de: "Verwendung", en: "How To Use"}],
    ["cardTextHowToUse", {de: "Wählen Sie Ihre Adresse mit dem Addressauswähler oben aus und klicken Sie auf eine der Karten unten.", en: "Select your address by using the Location Picker above, and then click on one of the cards below."}],
    ["cardTitleUpcomingPickups", {de: "Bevorstehende Abholungen anzeigen", en: "Show Upcoming Pickups"}],
    ["cardTitleAllPickups", {de: "Alle Abholungen anzeigen", en: "Show All Pickups"}],
    ["cardTitleCustomIcal", {de: "Eigenen iCal-Link erstellen", en: "Generate Custom iCal Link"}]

  ]);

  const actionCards: [url: string, title: string, icon: string][] = [
    ["/upcoming", "pageHome.cardTitleUpcomingPickups", mdiCalendar],
    ["/all", "pageHome.cardTitleAllPickups", mdiCalendarMultiselect],
    ["/icalgenerator", "pageHome.cardTitleCustomIcal", mdiCalendarExport]
  ]


</script>