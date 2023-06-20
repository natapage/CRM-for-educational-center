<script setup lang="ts">
import { ref } from "vue";
import { NInput, NSpace, NButton } from "naive-ui";
import { createClass } from "../API/ClassesApi.ts";

const className = ref<string>("");
const classDescription = ref<string>("");

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

async function handleCreateClass() {
  const body = {
    name: className.value,
    description: classDescription.value,
  };
  await createClass(body);
  emit("closeModal");
}
</script>

<template>
  <div class="container">
    <n-space vertical>
      <n-input
        v-model="className"
        size="large"
        type="text"
        placeholder="Название группы"
      />
      <n-input
        v-model="classDescription"
        size="large"
        type="textarea"
        placeholder="Описание группы"
      />
      <n-button @click="handleCreateClass" type="primary">Создать</n-button>
    </n-space>
  </div>
</template>

<style scoped>
.container {
  background-color: #ffffff;
  padding: 60px 120px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px; /* Set the maximum width of the container */
  margin: 0 auto; /* Center the container horizontally */
  /* margin-top: 100px; Adjust the top margin as per your preference */
}
</style>
