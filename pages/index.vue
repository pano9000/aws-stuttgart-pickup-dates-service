<template>

  <BasePageTemplate
    :page-title="i18n.t('pageHome.pageTitle')"
    :page-subtitle="i18n.t('pageHome.pageSubtitle')"
  >
    <template #mainContent>
      <v-row justify="center" class="text-center">
        <template v-for="actionCard in actionCards" :key="actionCard[0]">
          <v-col cols="12" md="6" lg="auto">

            <template v-if="!hasSetStreet">
              <v-dialog max-width="50rem" max-height="80vh">
                <template #activator="{ props: dialogActivatorProps }">
                  <v-card 
                    :title="i18n.t(actionCard[1])" class="pa-8" color="primary" link
                    v-bind="{...dialogActivatorProps}"
                  >
                    <v-card-text class="pa-4">
                      <v-icon :icon="actionCard[2]" size="4rem"/>
                    </v-card-text>
                  </v-card>
                </template>
                <template #default="{ isActive }">
                  <BaseLocationPicker @location-submitted="isActive.value = false"/>
                </template>

              </v-dialog>
            </template>

            <NuxtLink v-else :to="actionCard[0]" class="nuxtlink">
              <v-card :title="i18n.t(actionCard[1])" class="pa-8" color="primary" link>
                <v-card-text class="pa-4">
                  <v-icon :icon="actionCard[2]" size="4rem"/>
                </v-card-text>
              </v-card>
            </NuxtLink>

          </v-col>
        </template>
      </v-row>
    </template>
  </BasePageTemplate>

</template>

<script setup lang="ts">
  import { mdiCalendar, mdiCalendarMultiselect } from '@mdi/js';
  import { useCookieUserConfig } from "~/composables/useCookieUserConfig";
  import BaseLocationPicker from '~/components/LocationPicker/BaseLocationPicker.vue';

  const { i18n, multiMergeLocaleMessage } = useCustomI18n();
  const { hasSetStreet } = useCookieUserConfig();

  multiMergeLocaleMessage("pageHome", [
    ["pageTitle", {de: "Müll-Abfuhrtermine-Tool für Stuttgart", en: "Trash Collections Dates Tool for Stuttgart"}],
    [
      "pageSubtitle", {
        de: "Behalten Sie den Überblick über die Müll-Abfuhrtermine und verpassen Sie keine Abfuhr mehr",
        en: "Stay on top of the trash collection dates and never miss a collection again"
      }
    ],
    ["cardTitleHowToUse", {de: "Verwendung", en: "How To Use"}],
    ["cardTextHowToUse", {de: "Wählen Sie Ihre Adresse mit dem Addressauswähler oben aus und klicken Sie auf eine der Karten unten.", en: "Select your address by using the Location Picker above, and then click on one of the cards below."}],
    ["cardTitleUpcomingPickups", {de: "Nächste Abfuhr", en: "Next Collection"}],
    ["cardTitleAllPickups", {de: "Alle Abfuhren", en: "All Collections"}],
    //["cardTitleCustomIcal", {de: "iCalendar-Link erstellen", en: "Generate iCalendar Link"}]

  ]);

  const actionCards: [url: string, title: string, icon: string][] = [
    ["/upcoming", "pageHome.cardTitleUpcomingPickups", mdiCalendar],
    ["/all", "pageHome.cardTitleAllPickups", mdiCalendarMultiselect],
    //["/icalgenerator", "pageHome.cardTitleCustomIcal", mdiCalendarExport]
  ]


</script>