<script setup lang="ts">
import { watch } from "vue";

import { Task } from "../types/TasksTypes.ts";
import TaskForm from "../components/TaskForm.vue";

import { NTable, NSpace, NButton, NModal, NSpin } from "naive-ui";

import { useFetchPage } from "../composable/useFetchPage";
import { useNotificationHandler } from "../composable/useNotification";
import { useDeleteEntity } from "../composable/useDeleteEntity";
import { useCreateEntity } from "../composable/useCreateEntity";

const {
  entities: tasks,
  error: fetchError,
  showSpinner,
  fetchPage,
} = useFetchPage<Task>("tasks");

const {
  error: deleteError,
  deleteItem,
  handleConfirmation,
  isShowModalConfirm,
} = useDeleteEntity<Task>("tasks");

watch([fetchError, deleteError], () => notify("error"));

const { notify } = useNotificationHandler();
const { isShowModalCreate } = useCreateEntity();

async function handleCreateClass() {
  isShowModalCreate.value = false;
  await fetchPage();
}

async function handleDeleteTask() {
  await deleteItem();
  await fetchPage();
}
</script>

<template>
  <div>
    <n-space align="stretch" vertical>
      <h2>Список задач для педагогов</h2>
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
          <tr v-for="task in tasks" :key="task.id">
            <!-- <td></td> -->
            <td>{{ task.attributes.teacher.data.attributes.name }}</td>
            <td>{{ task.attributes.description }}</td>
            <td>
              {{ new Date(task.attributes.date).toLocaleDateString() }}
            </td>
            <td>
              <n-button @click="handleConfirmation(task.id)">Удалить</n-button>
            </td>
            <td>
              <n-button>Изменить</n-button>
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
    </n-space>
    <n-modal v-model:show="isShowModalCreate" @closeModal="handleCreateClass">
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
</style>
