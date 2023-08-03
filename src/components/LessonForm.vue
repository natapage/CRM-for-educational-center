<script setup lang="ts">
import { ref, watch } from "vue";
import { NButton, FormInst, NForm, NFormItem, NInput } from "naive-ui";
import { useCreateEntity } from "../composable/useCreateEntity";
import { useNotificationHandler } from "../composable/useNotification";

const emit = defineEmits<{
  (e: "close-modal"): void;
}>();

const { error: createError, createItem } = useCreateEntity();
const { notify } = useNotificationHandler();
const formRef = ref<FormInst | null>(null);

const model = ref({
  lessonName: null,
  lessonDescription: null,
  lessonDuration: null,
});

const rules = {
  lessonName: {
    required: true,
    trigger: ["input"],
    message: "Пожалуйста, введите название урока",
  },
  lessonDescription: {
    required: true,
    message: "Пожалуйста, введите описание урока",
  },
  lessonDuration: {
    required: true,
    message: "Пожалуйста, введите продолжительность",
  },
};

watch(createError, () => notify("error", "Ошибка добавления нового урока"));

function handleCreateLesson(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const body = {
        name: model.value.lessonName,
        description: model.value.lessonDescription,
        duration: model.value.lessonDuration,
      };
      const response = await createItem(body, "lessons");
      console.log(response);
      if (!createError.value) {
        notify("success", "Задача успешно добавлена");
      }
      emit("close-modal");
    }
  });
}
</script>

<template>
  <div class="container">
    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      require-mark-placement="right-hanging"
      label-width="auto"
      :style="{
        maxWidth: '640px',
      }"
    >
      <n-form-item label="Название урока" path="lessonName">
        <n-input
          v-model:value="model.lessonName"
          placeholder="Введите название"
        />
      </n-form-item>
      <n-form-item label="Описание урока" path="lessonDescription">
        <n-input
          v-model:value="model.lessonDescription"
          placeholder="Введите описание"
          type="textarea"
          :autosize="{
            minRows: 3,
            maxRows: 5,
          }"
        />
      </n-form-item>
      <n-form-item label="Продолжительность урока" path="taskDescription">
        <n-input
          v-model:value="model.lessonDuration"
          placeholder="Введите продолжительность урока"
        />
      </n-form-item>
    </n-form>
    <n-button
      round
      :disabled="model.lessonDescription === null || model.lessonName === null"
      class="add-button"
      @click="handleCreateLesson"
      type="primary"
      >Добавить урок</n-button
    >
  </div>
</template>

<style scoped>
.container {
  background-color: #ffffff;
  padding: 60px 120px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 400px; /* Set the width of the container */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.add-button {
  position: absolute;
  bottom: 20px;
  right: 120px;
}
</style>
