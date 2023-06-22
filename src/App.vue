<script setup lang="ts">
import MainLayout from "./layouts/MainLayout.vue";
import { NNotificationProvider } from "naive-ui";
</script>

<template>
  <n-notification-provider>
    <main-layout>
      <router-view></router-view>
    </main-layout>
  </n-notification-provider>
</template>

<style scoped></style>
