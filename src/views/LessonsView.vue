<script setup lang="ts">
import LessonForm from "../components/LessonForm.vue";
import { Lesson } from "../types/LessonsTypes.ts";
import { LessonTable } from "../types/TablesTypes.ts";
import { watch, onMounted, computed, h } from "vue";
import router from "../router/router";
import {
  NButton,
  NSpace,
  NModal,
  NDataTable,
  DataTableColumns,
} from "naive-ui";
import { useFetch } from "../composable/useFetch";
import { useNotificationHandler } from "../composable/useNotification";
import { useDeleteEntity } from "../composable/useDeleteEntity";
import { useCreateEntity } from "../composable/useCreateEntity";

onMounted(async () => await refetch());

const { notify } = useNotificationHandler();

const {
  data: lessons,
  error: fetchError,
  showSpinner,
  refetch,
} = useFetch<Lesson[]>("lessons");

const {
  error: deleteError,
  deleteItem,
  handleConfirmation,
  isShowModalConfirm,
} = useDeleteEntity<Lesson>("lessons");

async function handleDelete() {
  console.log(lessons.value);
  await deleteItem();
  await refetch();
}

const { isShowModalCreate } = useCreateEntity();

async function handleCreateLesson() {
  isShowModalCreate.value = false;
  await refetch();
}

watch([fetchError, deleteError], () =>
  notify("error", "Ошибка загрузки странички")
);

function goToProfile(lessonId: number | string) {
  router.push({ name: "lesson-profile", params: { id: lessonId } });
}
const columns = computed(() =>
  createColumns({ goToProfile, handleConfirmation })
);
const createColumns = ({
  goToProfile,
  handleConfirmation,
}): DataTableColumns<LessonTable> => [
  {
    title: "Название урока",
    key: "name",
  },
  {
    title: "Цели и задачи урока",
    key: "description",
  },
  {
    title: "Продолжительность",
    key: "duration",
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
          () => "Перейти в профиль"
        ),
        h(
          NButton,
          {
            type: "error",
            ghost: true,
            onClick: () => handleConfirmation(),
          },
          () => "Удалить"
        ),
      ]);
    },
  },
];

const data: LessonTable[] = computed(() => {
  return lessons.value?.map((lesson) => {
    return {
      id: lesson.id,
      name: lesson.attributes.name,
      description: lesson.attributes.description,
      duration: lesson.attributes.duration,
    };
  });
});
</script>

<template>
  <div>
    <n-space align="stretch" vertical>
      <h2>Список уроков</h2>
      <div class="table container">
        <n-data-table
          :loading="showSpinner"
          :columns="columns"
          :data="data"
          :bordered="false"
          :max-height="400"
          virtual-scroll
        />
      </div>
      <n-button
        class="add-button"
        type="primary"
        @click="isShowModalCreate = true"
        v-if="!showSpinner"
      >
        Добавить группу
      </n-button>
    </n-space>
    <n-modal v-model:show="isShowModalCreate" @close-modal="handleCreateLesson">
      <lesson-form></lesson-form>
    </n-modal>
    <n-modal
      v-model:show="isShowModalConfirm"
      preset="dialog"
      title="Подтвердите удаление"
      content="Уверены что хотите удалить этот урок?"
      positive-text="Удалить"
      negative-text="Отмена"
      @positive-click="handleDelete"
      @negative-click="isShowModalConfirm = false"
    />
  </div>
</template>

<style scoped>
.spinner-container {
  margin-top: 20px;
}
.row:hover > td {
  cursor: pointer;
  background-color: rgba(24, 160, 88, 0.1);
}
</style>
