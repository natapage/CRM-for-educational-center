<script setup lang="ts">
import { Class } from "../types/ClassesTypes.ts";
import { getClassesWithEntities, deleteClass } from "../API/ClassesApi.ts";
import { ref, onMounted } from "vue";
import { NTable, NButton, NSpace, NModal, NSpin } from "naive-ui";
import ClassForm from "../components/ClassForm.vue";

const classes = ref<Class[]>([]);
const showModal = ref<boolean>(false);
const showSpinner = ref<boolean>(false);

async function fetchPage() {
  showSpinner.value = true;
  const response = await getClassesWithEntities();
  showSpinner.value = false;
  if (response) {
    classes.value = response.data;
  } else {
    classes.value = []; // если кака- то ошибка в fetch запросе, то оставляет масссив пустым
  }
}

async function handleDeleteClass(id: number) {
  await deleteClass(id);
  await fetchPage();
}

function handleCreateClass() {
  showModal.value = false;
  fetchPage();
}

onMounted(() => {
  fetchPage();
});
</script>

<template>
  <n-space align="start" vertical>
    <h2>Список учебных групп</h2>
    <div class="table-container">
      <n-table :bordered="false" :single-line="false" full-width>
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
      <div class="spinner-container" v-if="showSpinner">
        <n-spin size="medium" />
      </div>
    </div>
    <n-button
      class="add-button"
      type="primary"
      @click="showModal = true"
      v-if="!showSpinner"
    >
      Добавить группу
    </n-button>
  </n-space>
  <n-modal v-model:show="showModal" @closeModal="handleCreateClass">
    <class-form></class-form>
  </n-modal>
</template>

<style scoped>
.spinner-container {
  margin-top: 20px;
}
</style>
