<script setup lang="ts">
import { Class } from "../types/ClassesTypes.ts";
import { getClassesWithEntities, deleteClass } from "../API/ClassesApi.ts";
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
import ClassForm from "../components/ClassForm.vue";

const classes = ref<Class[]>([]);
const showModalCreate = ref<boolean>(false);
const showModalConfirm = ref<boolean>(false);
const classIdToDelete = ref<number>();

const showSpinner = ref<boolean>(false);
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
      content: "Новая группа успешно добавлена",
      // meta: "",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
};

async function fetchPage() {
  showSpinner.value = true;
  try {
    const response = await getClassesWithEntities();
    showSpinner.value = false;
    if (response) {
      classes.value = response.data;
    } else {
      classes.value = [];
    }
  } catch (error) {
    console.log(error);
    notify("error");
    showSpinner.value = false;
    classes.value = [];
  }
}

async function handleConfirmation(id: number) {
  showModalConfirm.value = true;
  classIdToDelete.value = id;
}

async function handleDeleteClass() {
  const id = classIdToDelete.value as number;
  await deleteClass(id);
  await fetchPage();
}

function handleCreateClass() {
  notify("success");
  showModalCreate.value = false;
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
              <n-button @click="handleConfirmation(group.id)">Удалить</n-button>
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
      @click="showModalCreate = true"
      v-if="!showSpinner"
    >
      Добавить группу
    </n-button>
  </n-space>
  <n-modal v-model:show="showModalCreate" @closeModal="handleCreateClass">
    <class-form></class-form>
  </n-modal>
  <n-modal
    v-model:show="showModalConfirm"
    preset="dialog"
    title="Подтвердите удаление"
    content="Уверены что хотите удалить этого ученика?"
    positive-text="Удалить"
    negative-text="Отмена"
    @positive-click="handleDeleteClass"
    @negative-click="showModalConfirm = false"
  />
</template>

<style scoped>
.spinner-container {
  margin-top: 20px;
}
</style>
