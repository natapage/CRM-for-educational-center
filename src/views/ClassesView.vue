<script setup lang="ts">
import {
  Entitie,
  EntitiesResponse,
  getClassesWithEntities,
  deleteClass,
} from "../api";
import { ref, onMounted } from "vue";
import { NTable, NButton, NSpace, NModal } from "naive-ui";
import ClassForm from "../components/ClassForm.vue";

const classes = ref<Entitie[]>([]);
const showModal = ref<boolean>(false);

async function fetchPage() {
  const response: EntitiesResponse = await getClassesWithEntities();
  classes.value = response.data;
}

async function handleDeleteClass(id: number) {
  await deleteClass(id);
  await fetchPage();
}

// async function handleCreateClass() {
//   const body = {
//     name: className.value,
//     description: taskDescription.value,
//   };

//   await createTask(body);
//   taskName.value = "";
//   taskDescription.value = "";
//   await fetchPage();
// }

onMounted(() => {
  fetchPage();
});
</script>

<template>
  <n-space align="start" vertical>
    <h2>Список учебных групп</h2>
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>Название</th>
          <th>Педагог</th>
          <th>Ученики</th>
          <th>Образовательные задачи</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in classes" :key="group.id">
          <td>{{ group.attributes.name }}</td>
          <td>{{}}</td>
          <td>{{}}</td>
          <td>{{ group.attributes.description }}</td>
          <td>
            <n-button @click="handleDeleteClass(group.id)">Удалить</n-button>
          </td>
        </tr>
      </tbody>
    </n-table>
    <n-button class="add-button" type="primary" @click="showModal = true">
      Добавить группу
    </n-button>
  </n-space>
  <n-modal v-model:show="showModal"><class-form></class-form></n-modal>
</template>

<style scoped></style>
