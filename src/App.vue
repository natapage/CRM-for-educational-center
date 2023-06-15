<script setup lang="ts">
import MainLayout from "./layouts/MainLayout.vue";
</script>

<template>
  <div class="container">
    <main-layout>
      <RouterView></RouterView>
    </main-layout>
  </div>
</template>

<style scoped>
.container {
  display: flex;
}
</style>
