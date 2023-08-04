<script setup lang="ts">
import { BASE } from "../constants/constants";
import TaskForm from "../components/TaskForm.vue";
import { Task, RowType } from "../types/TasksTypes.ts";
import { Teacher } from "../types/TeachersTypes.ts";
import router from "../router/router";
import { useRoute } from "vue-router";
import { watch, ref, computed, onMounted, h } from "vue";
import {
  NDataTable,
  DataTableColumns,
  NButton,
  NModal,
  NSelect,
  NCheckbox,
  NGradientText,
  NSpace,
} from "naive-ui";
import { useFetch } from "../composable/useFetch";
import { useNotificationHandler } from "../composable/useNotification";
import { useDeleteEntity } from "../composable/useDeleteEntity";
import { useCreateEntity } from "../composable/useCreateEntity";
import { editEntity } from "../API/requestsApi";

const { notify } = useNotificationHandler();

const route = useRoute();

const selectedTeacher = ref<string>();

watch(
  () => route.query.name as string,
  (newValue) => {
    selectedTeacher.value = newValue;
  },
  { immediate: true }
);

const {
  data: tasks,
  error: fetchError,
  showSpinner,
  refetch: refetchTasks,
} = useFetch<Task[]>("tasks");

const { data: teachers, refetch: refetchTeachers } =
  useFetch<Teacher[]>("teachers");

onMounted(async () => {
  await refetchTeachers(), await refetchTasks();
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

const filteredTasks = computed(() => {
  if (selectedTeacher.value) {
    return tasks.value?.filter(
      (task) =>
        task.attributes.teacher.data.attributes.name === selectedTeacher.value
    );
  }
  return tasks.value?.sort((a, b) =>
    !b.attributes.isDone && a.attributes.isDone ? 1 : -1
  );
});

async function handleToggle(taskId: number, value: boolean) {
  const url = `${BASE}/api/tasks/${taskId}`;
  const task = (tasks.value || []).find((task) => task.id === taskId);
  if (task) {
    await editEntity<Task, unknown>({ ...task, isDone: value }, url);
    refetchTasks();
  }
}

function goToProfile(taskId: number | string) {
  router.push({ name: "task-profile", params: { id: taskId } });
}

const columns = computed(() =>
  createColumns({ goToProfile, handleConfirmation })
);

const createColumns = ({
  goToProfile,
  handleConfirmation,
}: {
  goToProfile: (id: string | number) => void;
  handleConfirmation: (id: number) => void;
}): DataTableColumns<RowType> => [
  {
    title: "Учитель",
    key: "name",
    width: "200",
  },
  {
    title: "Описание Задачи",
    key: "description",
    width: "350",
  },
  {
    title: "Дата выполнения",
    key: "date",
    width: "160",
  },
  {
    title: "Выполнено",
    key: "done",
    width: "170",
    render(row) {
      return h("div", [
        h(NCheckbox, {
          size: "large",
          onUpdateChecked: (value) => handleToggle(row.id, value),
          checked: row.isDone,
        }),
      ]);
    },
  },
  {
    title: "",
    key: "actions",
    render(row) {
      return h(NSpace, {}, () => [
        h(
          NButton,
          {
            type: "primary",
            ghost: true,
            onClick: () => goToProfile(row.id),
          },
          () => "Перейти к задаче"
        ),
        h(
          NButton,
          {
            type: "error",
            ghost: true,
            onClick: () => handleConfirmation(row.id),
          },
          () => "Удалить"
        ),
      ]);
    },
  },
];

function rowClassName(row: RowType) {
  return row.isDone ? "inactive-row" : "";
}

const data = computed(() => {
  return filteredTasks.value?.map((task) => {
    return {
      id: task.id,
      name: task.attributes.teacher?.data?.attributes?.name,
      description: task.attributes.description,
      date: new Date(task.attributes.date).toLocaleDateString(),
      isDone: task.attributes.isDone,
    };
  });
});
</script>

<template>
  <div>
    <n-space vertical>
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
      <n-gradient-text v-if="filteredTasks?.length === 0" type="warning">
        Нет текущих задач для выбранного педагога
      </n-gradient-text>
      <n-data-table
        v-else
        :loading="showSpinner"
        :columns="columns"
        :data="data"
        :bordered="false"
        :max-height="400"
        virtual-scroll
        :row-class-name="rowClassName"
      />

      <n-button
        class="add-button"
        type="primary"
        @click="isShowModalCreate = true"
        v-if="!showSpinner"
      >
        Добавить задачу
      </n-button>
    </n-space>
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
.select-container {
  width: 400px;
}
.row:hover > td {
  cursor: pointer;
  background-color: rgba(24, 160, 88, 0.1);
}
:deep(.inactive-row td) {
  background-color: rgba(162, 162, 162, 0.1);
}
</style>
