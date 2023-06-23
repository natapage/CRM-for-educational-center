<script setup lang="ts">
import { Student } from "../types/StudentsTypes.ts";
import { getStudentsWithEntities, deleteStudent } from "../API/StudentsApi";
import { ref, onMounted } from "vue";
import {
  NTable,
  NButton,
  NSpace,
  NModal,
  NSpin,
  useNotification,
  NotificationType,
} from "naive-ui";
import StudentForm from "../components/StudentForm.vue";
const notification = useNotification();
const notify = (type: NotificationType) => {
  if (type === "error") {
    return notification[type]({
      content: "Ошибка при загрузке страницы",
      meta: "попробуйте снова",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
  if (type === "success") {
    return notification[type]({
      content: "Новый ученик успешно добавлен",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
};

const students = ref<Student[]>([]);
const showModalCreate = ref<boolean>(false);
const showModalConfirm = ref<boolean>(false);
const studentIdToDelete = ref<number>();
const showSpinner = ref<boolean>(false);

async function fetchPage() {
  showSpinner.value = true;
  try {
    const response = await getStudentsWithEntities();
    showSpinner.value = false;
    if (response) {
      students.value = response.data;
    } else {
      students.value = [];
    }
  } catch (error) {
    console.log(error);
    notify("error");
    showSpinner.value = false;
    students.value = [];
  }
}

async function handleCreateStudent() {
  notify("success");
  showModalCreate.value = false;
  await fetchPage();
}

async function handleConfirmation(id: number) {
  showModalConfirm.value = true;
  studentIdToDelete.value = id;
}

async function handleDeleteStudent() {
  const id = studentIdToDelete.value as number;
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
          <td>{{ new Date(student.attributes.date).toLocaleDateString() }}</td>
          <td>{{ student.attributes.phone }}</td>
          <td>{{ student.attributes.class.data.attributes.name }}</td>
          <td>{{ student.attributes.description }}</td>
          <td>
            <n-button @click="handleConfirmation(student.id)">Удалить</n-button>
          </td>
        </tr>
      </tbody>
    </n-table>
    <div class="spinner-container" v-if="showSpinner">
      <n-spin size="medium" />
    </div>
    <n-button class="add-button" type="primary" @click="showModalCreate = true">
      Добавить ученика
    </n-button>
  </n-space>
  <n-modal v-model:show="showModalCreate" @close-modal="handleCreateStudent">
    <student-form :students="students"></student-form>
  </n-modal>
  <n-modal
    v-model:show="showModalConfirm"
    preset="dialog"
    title="Подтвердите удаление"
    content="Уверены что хотите удалить этого ученика?"
    positive-text="Удалить"
    negative-text="Отмена"
    @positive-click="handleDeleteStudent"
    @negative-click="showModalConfirm = false"
  />
</template>

<style scoped>
.spinner-container {
  margin-top: 20px;
}
</style>
