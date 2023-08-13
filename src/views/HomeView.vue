<script setup lang="ts">
import { NImage, NSpace } from "naive-ui";
import { ref } from "vue";

const url = ref<string>(
  `${import.meta.env.VITE_API_BASE_URL}` +
    "/uploads/large_1619763173_17_phonoteka_org_p_fon_dlya_saita_obrazovatelnogo_uchrezhdeni_19_664005d488.jpg"
);
</script>

<template>
  <NSpace justify="center" align="center">
    <n-image :src="url"></n-image>
  </NSpace>
</template>

<style scoped></style>
