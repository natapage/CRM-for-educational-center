<script setup lang="ts">
import TeacherForm from "../components/TeacherForm.vue";
import { Teacher } from "../types/TeachersTypes.ts";
// import { Task } from "../types/TasksTypes";
// import { BASE } from "../constants/constants";
import router from "../router/router";
import { watch, onMounted, h, computed, Component } from "vue";
import {
  NAvatar,
  NDataTable,
  NButton,
  NModal,
  NSpin,
  NSpace,
  DataTableColumns,
  NDropdown,
  NIcon,
} from "naive-ui";
import { CheckmarkCircleOutline } from "@vicons/ionicons5";
// import { deleteEntity } from "../API/requestsApi";
import { useFetch } from "../composable/useFetch";
import { useDeleteEntity } from "../composable/useDeleteEntity";
import { useCreateEntity } from "../composable/useCreateEntity";
import { useNotificationHandler } from "../composable/useNotification";

onMounted(async () => await refetch());

const { notify } = useNotificationHandler();

const {
  data: teachers,
  error: fetchError,
  showSpinner,
  refetch,
} = useFetch<Teacher[]>("teachers");

const {
  error: deleteTeacherError,
  handleConfirmation,
  deleteItem: deleteTeacher,
  isShowModalConfirm,
} = useDeleteEntity<Teacher>("teachers");

async function handleDeleteTeacher() {
  await deleteTeacher();
  await refetch();
}

const { isShowModalCreate } = useCreateEntity();

async function handleCreateTeacher() {
  isShowModalCreate.value = false;
  await refetch();
}

watch([fetchError, deleteTeacherError], () =>
  notify("error", "Ошибка загрузки страницы")
);

function goToProfile(teacherId: number | string) {
  router.push({ name: "teacher-profile", params: { id: teacherId } });
}

function goToTasks() {
  router.push({ name: "tasks" });
}

const columns = computed(() =>
  createColumns({ goToProfile, handleConfirmation })
);

const createColumns = ({
  goToProfile,
  handleConfirmation,
}): DataTableColumns<Teacher> => [
  {
    title: "Фото",
    key: "photo",
    width: "100",
    render(row) {
      return h(NAvatar, {
        round: true,
        size: "large",
        src: "http://localhost:1337" + row.photo,
      });
    },
  },
  {
    title: "Имя педагога",
    key: "name",
  },
  {
    title: "Номер телефона",
    key: "phone",
    width: "170",
  },
  {
    title: "Группы",
    key: "classes",
  },
  {
    title: "Задачи",
    key: "tasks",
    width: "100",
    render(row) {
      return h(NDropdown, { trigger: "hover", options: row.tasks }, () => [
        h(
          NButton,
          { type: "success", quaternary: true, onClick: () => goToTasks() },
          () => "Задачи"
        ),
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

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

const data = computed(() => {
  return teachers.value?.map((teacher: Teacher) => {
    return {
      id: teacher.id,
      name: teacher.attributes.name,
      phone: teacher.attributes.phone,
      tasks: teacher.attributes.tasks?.data.map((item) => ({
        label: item.attributes.description,
        key: item.id,
        icon: renderIcon(CheckmarkCircleOutline),
      })),
      photo: teacher.attributes.photo?.data.attributes.formats.thumbnail.url,
      classes: teacher.attributes.classes.data
        .map((item) => item.attributes.name)
        .join(", "),
    };
  });
});
</script>
<template>
  <div>
    <n-space vertical>
      <h2>Список учителей</h2>
      <n-data-table
        :loading="showSpinner"
        :columns="columns"
        :data="data"
        :bordered="false"
        :max-height="400"
        virtual-scroll
      />
      <n-button
        class="add-button"
        type="primary"
        @click="isShowModalCreate = true"
        v-if="!showSpinner"
      >
        Добавить учителя
      </n-button>
      <div class="spinner-container" v-if="showSpinner">
        <n-spin size="medium" />
      </div>
      <n-modal
        v-model:show="isShowModalConfirm"
        preset="dialog"
        title="Подтвердите удаление"
        content="Уверены что хотите удалить этого учителя?"
        positive-text="Удалить"
        negative-text="Отмена"
        @positive-click="handleDeleteTeacher"
        @negative-click="isShowModalConfirm = false"
      />
    </n-space>
    <n-modal
      v-model:show="isShowModalCreate"
      @close-modal="handleCreateTeacher"
    >
      <teacher-form :teachers="teachers"></teacher-form>
    </n-modal>
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
