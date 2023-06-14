<script setup lang="ts">
import MainLayout from "./layouts/MainLayout.vue";
</script>

<template>
  <div class="container">
    <main-layout></main-layout>
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
.container {
  display: flex;
}
</style>
