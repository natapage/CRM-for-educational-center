<script setup lang="ts">
import MainLayout from "./layouts/MainLayout.vue";
import { NNotificationProvider, NMessageProvider } from "naive-ui";
</script>

<template>
  <n-message-provider>
    <n-notification-provider>
      <main-layout>
        <router-view></router-view>
      </main-layout>
    </n-notification-provider>
  </n-message-provider>
</template>

<style scoped></style>
