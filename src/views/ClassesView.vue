<script setup lang="ts">
import { Class } from "../types/ClassesTypes.ts";
import ClassForm from "../components/ClassForm.vue";
import { watch } from "vue";
import { NTable, NButton, NSpace, NModal, NSpin } from "naive-ui";
import { useFetchPage } from "../composable/useFetchPage";
import { useNotificationHandler } from "../composable/useNotification";
import { useDeleteEntity } from "../composable/useDeleteEntity";
import { useCreateEntity } from "../composable/useCreateEntity";

const {
  entities: classes,
  error: fetchError,
  showSpinner,
  fetchPage,
} = useFetchPage<Class>("classes");

const {
  error: deleteError,
  deleteItem,
  handleConfirmation,
  isShowModalConfirm,
} = useDeleteEntity<Class>("classes");

watch([fetchError, deleteError], () => notify("error"));

const { notify } = useNotificationHandler();
const { isShowModalCreate } = useCreateEntity();

async function handleCreateClass() {
  isShowModalCreate.value = false;
  await fetchPage();
}

async function handleDelete() {
  console.log(classes.value);
  await deleteItem();
  await fetchPage();
}
</script>

<template>
  <div>
    <n-space align="stretch" vertical>
      <h2>Список учебных групп</h2>
      <n-table :bordered="false" :single-line="false" full-width>
        <thead>
          <tr>
            <th>Название</th>
            <th>Педагог</th>
            <th>Ученики</th>
            <th>Образовательные задачи</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="group in classes" :key="group.id">
            <td>{{ group.attributes.name }}</td>
            <td>{{ group.attributes.teacher?.data?.attributes?.name }}</td>
            <td>{{}}</td>
            <td>{{ group.attributes.description }}</td>
            <td>
              <n-button @click="handleConfirmation(group.id)">Удалить</n-button>
            </td>
            <td>
              <n-button>Изменить</n-button>
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
        v-if="!showSpinner"
      >
        Добавить группу
      </n-button>
    </n-space>
    <n-modal v-model:show="isShowModalCreate" @closeModal="handleCreateClass">
      <class-form></class-form>
    </n-modal>
    <n-modal
      v-model:show="isShowModalConfirm"
      preset="dialog"
      title="Подтвердите удаление"
      content="Уверены что хотите удалить эту группу?"
      positive-text="Удалить"
      negative-text="Отмена"
      @positive-click="handleDelete"
      @negative-click="isShowModalConfirm = false"
    />
  </div>
</template>

<style scoped>
.spinner-container {
  margin-top: 20px;
}
</style>
