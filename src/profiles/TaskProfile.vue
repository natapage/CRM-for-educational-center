<script setup lang="ts">
import { Task, TasksResponse } from "../types/TasksTypes";
import { ref, onMounted, watch } from "vue";
import {
  NList,
  NThing,
  NListItem,
  NButton,
  NSpace,
  NInput,
  NDatePicker,
  NSpin,
} from "naive-ui";
import { useRoute } from "vue-router";
import router from "../router/router";
import { useFetch } from "../composable/useFetch";
import { useEditEntity } from "../composable/useEditEntity";
import { useNotificationHandler } from "../composable/useNotification";

onMounted(async () => {
  await refetchTask();
});

const { notify } = useNotificationHandler();

const route = useRoute();

const taskId = ref<number>(Number(route.params.id));

const isEditing = ref<boolean>(false);
const descriptionToCreate = ref<string | undefined>();
const dateToCreate = ref<Date>();

const { refetch: refetchTasks, error: refetchTasksError } =
  useFetch<Task[]>("tasks");

const {
  data: task,
  error: fetchTaskError,
  showSpinner,
  refetch: refetchTask,
} = useFetch<Task>(`tasks/${taskId.value}`);

const { error: editError, editItem } = useEditEntity<TasksResponse, Task>(
  `tasks/${taskId.value}`
);

async function handleEditTask() {
  const body: any = {
    description:
      descriptionToCreate.value || task.value?.attributes.description,
    date: dateToCreate.value || task.value?.attributes.date,
  };

  await editItem(body);
  if (!editError.value) {
    notify("success", "Задача успешно отредактирована");
  }
  if (editError.value) {
    notify("error", "Ошибка редактирования");
  }
  refetchTasks();
  isEditing.value = false;
  router.push(`/tasks`);
}

function formatDate(date: string | undefined) {
  if (!date) return "";
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Date(date).toLocaleDateString("ru-RU", options);
}

function dateDisabled(ts: number) {
  const currentDate = new Date(); // Текущая дата
  const date = new Date(ts);
  return date <= currentDate;
}

function setEditMode() {
  if (!task.value) return;
  isEditing.value = true;
  descriptionToCreate.value = task.value?.attributes.description;
  dateToCreate.value = new Date(task.value?.attributes?.date);
}

watch([refetchTasksError, fetchTaskError], () =>
  notify("error", "Ошибка загрузки странички")
);
</script>

<template>
  <div class="container">
    <n-button @click="router.push({ name: 'tasks' })" type="tertiary"
      >Назад</n-button
    >
    <n-space horizontal justify="space-between" align="center">
      <h2>Информация о задаче</h2>
      <n-button
        type="primary"
        @click="setEditMode"
        v-if="!isEditing && !showSpinner"
      >
        Редактировать данные</n-button
      >
      <n-space horizontal v-else>
        <n-button v-if="!showSpinner" @click="isEditing = false">
          Отменить изменения</n-button
        >
        <n-button v-if="!showSpinner" type="primary" @click="handleEditTask">
          Сохранить изменения</n-button
        >
      </n-space>
    </n-space>
    <div class="spinner-container" v-if="showSpinner">
      <n-spin size="medium" />
    </div>
    <n-list v-if="!showSpinner">
      <n-list-item>
        <n-thing title="Описание задачи">
          <div v-if="!isEditing">{{ task?.attributes.description }}</div>
          <n-input
            v-else
            v-model:value="descriptionToCreate"
            type="text"
            :placeholder="task?.attributes.description"
          />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Дата выполнения задачи">
          <div v-if="!isEditing">
            {{ formatDate(task?.attributes.date) }}
          </div>
          <n-date-picker
            v-else
            format="yyyy-MM-dd"
            :is-date-disabled="dateDisabled"
            v-model="dateToCreate"
            type="date"
            :default-formatted-value="task?.attributes.date"
          />
        </n-thing>
      </n-list-item>
    </n-list>
  </div>
</template>

<style scoped>
.card {
  text-align: left;
}
.container {
  width: 900px;
}
</style>
