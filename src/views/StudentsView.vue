<script setup lang="ts">
import { Entitie } from "../types";
import { getStudentsWithEntities } from "../api";
import { ref, onMounted } from "vue";
import { NTable, NButton, NSpace } from "naive-ui";

let students = ref<Entitie[]>([]);

async function fetchPage() {
  const response = await getStudentsWithEntities();
  students.value = response.data;
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
        </tr>
      </tbody>
    </n-table>
    <n-button class="add-button" type="primary"> Добавить ученика </n-button>
  </n-space>
</template>

<style scoped></style>
