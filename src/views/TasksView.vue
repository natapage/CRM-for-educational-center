<script setup lang="ts">
import TaskForm from "../components/TaskForm.vue";
import { Task } from "../types/TasksTypes.ts";
import { watch, ref, computed } from "vue";
import {
  NTable,
  NSpace,
  NButton,
  NModal,
  NSpin,
  NSelect,
  SelectOption,
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
  refetch,
} = useFetch<Task[]>("tasks");

const {
  error: deleteError,
  deleteItem,
  handleConfirmation,
  isShowModalConfirm,
} = useDeleteEntity<Task>("tasks");

async function handleDeleteTask() {
  await deleteItem();
  await refetch();
}

const { isShowModalCreate } = useCreateEntity();

async function handleCreateClass() {
  isShowModalCreate.value = false;
  await refetch();
}

watch([fetchError, deleteError], () => notify("error"));

const teachersWithTasks = computed<SelectOption[]>(() => {
  const teachersNames = tasks.value?.map(
    (item) => item.attributes.teacher.data.attributes.name
  );
  const sortedTeachersNames = [...new Set(teachersNames)];
  sortedTeachersNames.unshift("Показать всех");
  return sortedTeachersNames.map((item) => {
    return { label: item, value: item } as SelectOption;
  });
});

const selectedTeacher = ref(null);

const filteredTasks = computed(() => {
  if (selectedTeacher.value === "Показать всех") {
    return tasks.value;
  }
  if (selectedTeacher.value) {
    return tasks.value?.filter(
      (task) =>
        task.attributes.teacher.data.attributes.name === selectedTeacher.value
    );
  }
  return tasks.value;
});
</script>

<template>
  <div>
    <n-space align="stretch" vertical>
      <h2>Список задач для педагогов</h2>
      <div class="select-container">
        <n-select
          v-model:value="selectedTeacher"
          filterable
          tag
          :options="teachersWithTasks"
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
          <tr v-for="task in filteredTasks" :key="task.id">
            <!-- <td></td> -->
            <td>{{ task.attributes.teacher?.data?.attributes?.name }}</td>
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
.select-container {
  width: 400px; /* Задайте желаемую ширину для контейнера выпадающего списка */
  margin-bottom: 10px; /* Опционально: задайте отступ снизу, если требуется */
}
</style>
