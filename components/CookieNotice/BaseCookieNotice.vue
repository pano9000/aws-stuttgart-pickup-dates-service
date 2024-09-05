<template>
 <CookieNoticeBanner @open-dialog="activeDialog = true"/>
 <CookieNoticeDialog v-model:active="activeDialog"/>
</template>

<script setup lang="ts">
  import CookieNoticeBanner from "./CookieNoticeBanner.vue";
  import CookieNoticeDialog from "./CookieNoticeDialog.vue";

  const activeDialog = ref(false);
</script>