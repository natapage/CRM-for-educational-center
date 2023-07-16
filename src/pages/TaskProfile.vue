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
} from "naive-ui";
import { useRoute } from "vue-router";
import router from "../router/router.ts";
import { useFetch } from "../composable/useFetch";
import { useEditEntity } from "../composable/useEditEntity";
import { useNotificationHandler } from "../composable/useNotification";

onMounted(() => {
  refetchTask();
});

const { notify, toCreateNotification } = useNotificationHandler();

const route = useRoute();

const taskId = ref<number>(Number(route.params.id));

const isEditing = ref<boolean>(false);
const descriptionToCreate = ref("");
const dateToCreate = ref();

const { refetch: refetchTasks, error: refetchTasksError } =
  useFetch<Task[]>("tasks");

const {
  data: task,
  error: fetchTaskError,
  refetch: refetchTask,
} = useFetch<Task>(`tasks/${taskId.value}`);

const { error: editError, editItem } = useEditEntity<Task>(
  `tasks/${taskId.value}`
);

async function handleEditTask() {
  const body: any = {
    description:
      descriptionToCreate.value || task.value?.attributes.description,
    date: dateToCreate.value || task.value?.attributes.date,
  };

  // TODO: изменить тип unknown
  await editItem<TasksResponse, unknown>(body);
  if (!editError.value) {
    toCreateNotification.create({
      type: "success",
      content: "Успешно отредактировано",
      meta: "Задача изменена",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
  if (editError.value) {
    notify("error");
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

watch([refetchTasksError, fetchTaskError], () => notify("error"));
</script>

<template>
  <div class="container">
    <n-space horizontal justify="space-between" align="center">
      <h2>Данные о педагоге</h2>
      <n-button type="primary" @click="isEditing = true" v-if="!isEditing">
        Редактировать данные</n-button
      >
      <n-space horizontal v-else>
        <n-button @click="isEditing = false"> Отменить изменения</n-button>
        <n-button type="primary" @click="handleEditTask">
          Сохранить изменения</n-button
        >
      </n-space>
    </n-space>
    <n-list>
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
            v-model:value="dateToCreate"
            type="date"
            :placeholder="formatDate(task?.attributes.date)"
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
