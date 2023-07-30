<script setup lang="ts">
import StudentForm from "../components/StudentForm.vue";
import { Student } from "../types/StudentsTypes.ts";
// import { StudentTable } from "../types/TablesTypes.ts";

import router from "../router/router.ts";
import { watch, onMounted, h, computed } from "vue";
import {
  NDataTable,
  NButton,
  NSpace,
  NModal,
  NSpin,
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

const createColumns = ({
  goToProfile,
  handleConfirmation,
}): DataTableColumns<Student> => [
  {
    title: "Имя ученика",
    key: "name",
  },
  {
    title: "Дата рождения",
    key: "date",
  },
  {
    title: "Номер телефона",
    key: "phone",
  },
  {
    title: "Группа",
    key: "class",
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
            onClick: () => handleConfirmation(),
          },
          () => "Удалить"
        ),
      ]);
    },
  },
];

const data: Student[] = computed(() => {
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
    <!-- <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>Имя ученика</th>
          <th>Дата рождения</th>
          <th>Номер телефона</th>
          <th>Группа</th>
          <th>Особая информация</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="student in students"
          :key="student.id"
          class="row"
          @click="goToProfile(student.id)"
        >
          <td>{{ student.attributes.name }}</td>
          <td>{{ new Date(student.attributes.date).toLocaleDateString() }}</td>
          <td>{{ student.attributes.phone }}</td>
          <td>{{ student?.attributes?.class?.data.attributes.name }}</td>
          <td>{{ student.attributes.description }}</td>
          <td>
            <n-button type="primary" ghost @click="goToProfile(student.id)"
              >Перейти в профиль</n-button
            >
          </td>
          <td>
            <n-button
              type="error"
              ghost
              @click.stop="handleConfirmation(student.id)"
              >Удалить</n-button
            >
          </td>
        </tr>
      </tbody>
    </n-table> -->
    <div class="spinner-container" v-if="showSpinner">
      <n-spin size="medium" />
    </div>
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
.spinner-container {
  margin-top: 20px;
}
.row:hover > td {
  cursor: pointer;
  background-color: rgba(24, 160, 88, 0.1);
}
</style>
