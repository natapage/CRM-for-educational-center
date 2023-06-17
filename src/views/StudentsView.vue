<script setup lang="ts">
import { Student, StudentResponse, getStudentsWithEntities } from "../api";
import { ref, onMounted } from "vue";
import { NTable } from "naive-ui";

let students = ref<Student[]>([]);

async function fetchPage() {
  const response: StudentResponse = await getStudentsWithEntities();
  students.value = response.data;
}

onMounted(() => {
  fetchPage();
});
</script>

<template>
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
      </tr>
    </tbody>
  </n-table>
</template>

<style lang="scss" scoped></style>
