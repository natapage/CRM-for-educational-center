<script setup lang="ts">
import StudentForm from "../components/StudentForm.vue";
import { Student } from "../types/StudentsTypes.ts";
import router from "../router/router.ts";
import { watch, onMounted, h, computed } from "vue";
import {
  NDataTable,
  NButton,
  NSpace,
  NModal,
  DataTableColumns,
} from "naive-ui";
import { useFetch } from "../composable/useFetch";
import { useDeleteEntity } from "../composable/useDeleteEntity";
import { useCreateEntity } from "../composable/useCreateEntity";
import { useNotificationHandler } from "../composable/useNotification";

onMounted(async () => await refetch());

const { notify } = useNotificationHandler();

const {
  data: students,
  error: fetchError,
  showSpinner,
  refetch,
} = useFetch<Student[]>("students");

const {
  error: deleteError,
  handleConfirmation,
  deleteItem,
  isShowModalConfirm,
} = useDeleteEntity<Student>("students");

async function handleDeleteStudent() {
  await deleteItem();
  await refetch();
}

const { isShowModalCreate } = useCreateEntity();

async function handleCreateStudent() {
  isShowModalCreate.value = false;
  await refetch();
}

watch([fetchError, deleteError], () =>
  notify("error", "Ошибка загрузки страницы")
);

function goToProfile(studentId: number | string) {
  router.push({ name: "student-profile", params: { id: studentId } });
}

const columns = computed(() =>
  createColumns({ goToProfile, handleConfirmation })
);

type RowType = {
  id: number;
  name: string;
  date: Date;
  phone: number;
  class: string;
  description: string;
};

const createColumns = ({
  goToProfile,
  handleConfirmation,
}: {
  goToProfile: (id: string | number) => void;
  handleConfirmation: (id: number) => void;
}): DataTableColumns<RowType> => [
  {
    title: "Имя ученика",
    key: "name",
    width: "180",
  },
  {
    title: "Дата рождения",
    key: "date",
    width: "150",
  },
  {
    title: "Номер телефона",
    key: "phone",
    width: "150",
  },
  {
    title: "Группа",
    key: "class",
    width: "150",
  },
  {
    title: "Особые указания",
    key: "description",
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
            onClick: () => handleConfirmation(row.id),
          },
          () => "Удалить"
        ),
      ]);
    },
  },
];

const data = computed(() => {
  return students.value?.map((student) => {
    return {
      id: student.id,
      name: student.attributes.name,
      date: new Date(student.attributes.date).toLocaleDateString(),
      phone: student.attributes.phone,
      class: student?.attributes?.class?.data.attributes.name,
      description: student.attributes.description,
    };
  });
});
</script>

<template>
  <n-space align="stretch" vertical>
    <h2>Список учащихся</h2>
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
    >
      Добавить ученика
    </n-button>
  </n-space>
  <n-modal v-model:show="isShowModalCreate" @close-modal="handleCreateStudent">
    <student-form :students="students"></student-form>
  </n-modal>
  <n-modal
    v-model:show="isShowModalConfirm"
    preset="dialog"
    title="Подтвердите удаление"
    content="Уверены что хотите удалить этого ученика?"
    positive-text="Удалить"
    negative-text="Отмена"
    @positive-click="handleDeleteStudent"
    @negative-click="isShowModalConfirm = false"
  />
</template>

<style scoped>
.row:hover > td {
  cursor: pointer;
  background-color: rgba(24, 160, 88, 0.1);
}
</style>
