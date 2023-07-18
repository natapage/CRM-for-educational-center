<script setup lang="ts">
import TaskForm from "../components/TaskForm.vue";
import { Task } from "../types/TasksTypes.ts";
import { Teacher } from "../types/TeachersTypes.ts";
import router from "../router/router";
import { watch, ref, computed, onMounted } from "vue";
import {
  NTable,
  NButton,
  NModal,
  NSpin,
  NSelect,
  NGradientText,
} from "naive-ui";
import { useFetch } from "../composable/useFetch";
import { useNotificationHandler } from "../composable/useNotification";
import { useDeleteEntity } from "../composable/useDeleteEntity";
import { useCreateEntity } from "../composable/useCreateEntity";

const { notify } = useNotificationHandler();

const {
  data: tasks,
  error: fetchError,
  showSpinner,
  refetch: refetchTasks,
} = useFetch<Task[]>("tasks");

const { data: teachers, refetch: refetchTeachers } =
  useFetch<Teacher[]>("teachers");

onMounted(() => {
  refetchTeachers(), refetchTasks();
});

const {
  error: deleteError,
  deleteItem,
  handleConfirmation,
  isShowModalConfirm,
} = useDeleteEntity<Task>("tasks");

async function handleDeleteTask() {
  await deleteItem();
  await refetchTasks();
}

const { isShowModalCreate } = useCreateEntity();

async function handleCreateTask() {
  isShowModalCreate.value = false;
  await refetchTasks();
}

watch([fetchError, deleteError], () =>
  notify("error", "Ошибка загрузки странички")
);

const teachersOptionsList = computed(() =>
  teachers.value?.map((item) => ({
    label: item.attributes.name,
    value: item.attributes.name,
  }))
);

const selectedTeacher = ref<string>();

const filteredTasks = computed(() => {
  if (selectedTeacher.value) {
    return tasks.value?.filter(
      (task) =>
        task.attributes.teacher.data.attributes.name === selectedTeacher.value
    );
  }
  return tasks.value;
});

function goToProfile(taskId: number | string) {
  router.push(`/tasks/${taskId}`);
}
</script>

<template>
  <div>
    <h2>Задачи для педагогов</h2>
    <div class="select-container">
      <n-select
        v-model:value="selectedTeacher"
        filterable
        tag
        :options="teachersOptionsList"
        clearable
        placeholder="Выберите учителя"
      >
      </n-select>
    </div>
    <n-table :bordered="false" :single-line="false" full-width>
      <thead>
        <tr>
          <th>Педагог</th>
          <th>Описание задачи</th>
          <th>Дата выполнения</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <n-gradient-text v-if="!filteredTasks?.length" type="warning">
          У педагога нет текущих задач
        </n-gradient-text>
        <tr v-for="task in filteredTasks" :key="task.id" class="row">
          <td>{{ task.attributes.teacher?.data?.attributes?.name }}</td>
          <td>{{ task.attributes.description }}</td>
          <td>
            {{ new Date(task.attributes.date).toLocaleDateString() }}
          </td>
          <td>
            <n-button @click.stop="goToProfile(task.id)" type="primary" ghost
              >Редактировать задачу</n-button
            >
          </td>
          <td>
            <n-button type="error" ghost @click="handleConfirmation(task.id)"
              >Удалить</n-button
            >
          </td>
        </tr>
      </tbody>
    </n-table>
    <div class="spinner-container" v-if="showSpinner">
      <n-spin size="medium" />
    </div>
    <n-button
      class="add-button"
      type="primary"
      @click="isShowModalCreate = true"
      v-if="!showSpinner"
    >
      Добавить задачу
    </n-button>
    <n-modal v-model:show="isShowModalCreate" @close-modal="handleCreateTask">
      <task-form></task-form>
    </n-modal>
    <n-modal
      v-model:show="isShowModalConfirm"
      preset="dialog"
      title="Подтвердите удаление"
      content="Уверены что хотите удалить эту задачу?"
      positive-text="Удалить"
      negative-text="Отмена"
      @positive-click="handleDeleteTask"
      @negative-click="isShowModalConfirm = false"
    />
  </div>
</template>

<style scoped>
.spinner-container {
  margin-top: 20px;
}
.select-container {
  width: 400px; /* Задайте желаемую ширину для контейнера выпадающего списка */
  margin-bottom: 10px; /* Опционально: задайте отступ снизу, если требуется */
}
.row:hover > td {
  cursor: pointer;
  background-color: rgba(24, 160, 88, 0.1);
}
</style>
