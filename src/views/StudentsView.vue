<script setup lang="ts">
import { Student } from "../types/StudentsTypes.ts";
import { getStudentsWithEntities, deleteStudent } from "../API/StudentsApi";
import { ref, onMounted } from "vue";
import { NTable, NButton, NSpace, NModal, NSpin } from "naive-ui";
import StudentForm from "../components/StudentForm.vue";

const students = ref<Student[]>([]);
const showModal = ref<boolean>(false);
const showSpinner = ref<boolean>(false);

async function fetchPage() {
  showSpinner.value = true;
  const response = await getStudentsWithEntities();
  showSpinner.value = false;
  if (response) {
    students.value = response.data;
  } else {
    students.value = [];
  }
}

async function handleCreateStudent() {
  showModal.value = false;
  await fetchPage();
}

async function handleDeleteStudent(id: number) {
  await deleteStudent(id);
  await fetchPage();
}

onMounted(() => {
  fetchPage();
});
</script>

<template>
  <n-space align="start" vertical>
    <h2>Список учащихся</h2>
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>Имя ученика</th>
          <th>Дата рождения</th>
          <th>Номер телефона</th>
          <th>Группа</th>
          <th>Особая информация</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.attributes.name }}</td>
          <td>{{ student.attributes.date }}</td>
          <td>{{ student.attributes.phone }}</td>
          <td>{{ student.attributes.class.data.attributes.name }}</td>
          <td>{{ student.attributes.description }}</td>
          <td>
            <n-button @click="handleDeleteStudent(student.id)"
              >Удалить</n-button
            >
          </td>
        </tr>
      </tbody>
    </n-table>
    <div class="spinner-container" v-if="showSpinner">
      <n-spin size="medium" />
    </div>
    <n-button class="add-button" type="primary" @click="showModal = true">
      Добавить ученика
    </n-button>
  </n-space>
  <n-modal v-model:show="showModal" @closeModal="handleCreateStudent">
    <student-form :students="students"></student-form>
  </n-modal>
</template>

<style scoped>
.spinner-container {
  margin-top: 20px;
}
</style>
