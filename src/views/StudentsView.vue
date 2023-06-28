<script setup lang="ts">
import { Student } from "../types/StudentsTypes.ts";
import { useFetchPage } from "../composable/useFetchPage";
import { useDeleteEntity } from "../composable/useDeleteEntity";
import { useCreateEntity } from "../composable/useCreateEntity";
import { NTable, NButton, NSpace, NModal, NSpin } from "naive-ui";
import StudentForm from "../components/StudentForm.vue";
import { watch } from "vue";
import { useNotificationHandler } from "../composable/useNotification";

const {
  entities: students,
  error: fetchError,
  showSpinner,
  fetchPage,
} = useFetchPage<Student>("students");

const {
  error: deleteError,
  showConfirmation,
  deleteItem,
  isShowModalConfirm,
} = useDeleteEntity<Student>("students");

const { notify } = useNotificationHandler();

watch([fetchError, deleteError], () => notify("error"));

const { isShowModalCreate } = useCreateEntity();

async function handleDeleteStudent() {
  console.log(students.value);
  await deleteItem();
  await fetchPage();
}

async function handleCreateStudent() {
  isShowModalCreate.value = false;
  await fetchPage();
}
</script>

<template>
  <n-space align="stretch" vertical>
    <h2>Список учащихся</h2>
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>Имя ученика</th>
          <th>Дата рождения</th>
          <th>Номер телефона</th>
          <th>Группа</th>
          <th>Особая информация</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.attributes.name }}</td>
          <td>{{ new Date(student.attributes.date).toLocaleDateString() }}</td>
          <td>{{ student.attributes.phone }}</td>
          <td>{{ student.attributes.class.data.attributes.name }}</td>
          <td>{{ student.attributes.description }}</td>
          <td>
            <n-button @click="showConfirmation(student.id)">Удалить</n-button>
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
</style>
