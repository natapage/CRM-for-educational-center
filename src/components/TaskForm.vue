<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

import {
  NButton,
  NSelect,
  FormInst,
  NForm,
  NFormItem,
  NInput,
  NDatePicker,
} from "naive-ui";

import { Teacher } from "../types/TeachersTypes";
import { useCreateEntity } from "../composable/useCreateEntity";
import { useNotificationHandler } from "../composable/useNotification";
import { useFetch } from "../composable/useFetch";

const emit = defineEmits<{
  (e: "close-modal"): void;
}>();

const { error: createError, createItem } = useCreateEntity();
const { notify } = useNotificationHandler();
const { data: teachers, refetch: refetchTeachers } =
  useFetch<Teacher[]>("teachers");
const formRef = ref<FormInst | null>(null);

onMounted(() => refetchTeachers());

const tasksOptionsList = computed(() =>
  teachers.value?.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }))
);

const model = ref({
  taskDescription: null,
  taskDate: null,
  teacherName: null,
});

const rules = {
  taskDescription: {
    required: true,
    trigger: ["input"],
    message: "Пожалуйста, опишите задачу",
  },
  taskDate: {
    required: true,
    message: "Пожалуйста, введите дату и время выполнения",
  },
  teacherName: {
    required: true,
    message: "Пожалуйста, выберете педагога",
  },
};
watch(createError, () => notify("error", "Ошибка добавления новой задачи"));

function dateDisabled(ts: number) {
  const currentDate = new Date(); // Текущая дата
  const date = new Date(ts);
  return date <= currentDate;
}

function handleCreateTask(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const body = {
        description: model.value.taskDescription,
        date: model.value.taskDate,
        teacher: {
          connect: [model.value.teacherName],
        },
      };
      // TODO: изменить тип unknown
      const response = await createItem(body, "tasks");
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
      <n-form-item label="Описание задачи" path="taskDescription">
        <n-input
          v-model:value="model.taskDescription"
          placeholder="Введите подробное описание задачи"
          type="textarea"
          :autosize="{
            minRows: 3,
            maxRows: 5,
          }"
        />
      </n-form-item>
      <n-form-item label="Дата выполнения" path="taskDate">
        <n-date-picker
          :is-date-disabled="dateDisabled"
          v-model:value="model.taskDate"
          type="datetime"
          format="dd-MM-yyyy"
          placeholder="Выберите дату"
        />
      </n-form-item>
      <n-form-item label="Ответственный педагог" path="teacherName">
        <n-select
          v-model:value="model.teacherName"
          placeholder="Выберете педагога"
          :options="tasksOptionsList"
        />
      </n-form-item>
    </n-form>
    <n-button
      round
      :disabled="model.taskDescription === null || model.taskDate === null"
      class="add-button"
      @click="handleCreateTask"
      type="primary"
      >Добавить задачу</n-button
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
