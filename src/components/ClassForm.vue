<script setup lang="ts">
import { ref } from "vue";
import { NInput, NSpace, NButton } from "naive-ui";
import { createClass } from "../api";

const className = ref<string>("");
const classDescription = ref<string>("");

async function handleCreateClass() {
  const body = {
    name: className.value,
    description: classDescription.value,
  };
  await createClass(body);
}
</script>

<template>
  <div>
    <n-space vertical>
      <n-input
        v-model:value="className"
        type="text"
        placeholder="Название группы"
      />
      <n-input
        v-model:value="classDescription"
        type="textarea"
        placeholder="Описание группы"
      />
      <n-button @click="handleCreateClass" type="primary">Создать</n-button>
    </n-space>
  </div>
</template>
