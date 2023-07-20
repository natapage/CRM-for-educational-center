<script setup lang="ts">
import ClassForm from "../components/ClassForm.vue";
import { Class } from "../types/ClassesTypes.ts";
import { watch, onMounted } from "vue";
import router from "../router/router.ts";
import { NTable, NButton, NSpace, NModal, NSpin } from "naive-ui";
import { useFetch } from "../composable/useFetch";
import { useNotificationHandler } from "../composable/useNotification";
import { useDeleteEntity } from "../composable/useDeleteEntity";
import { useCreateEntity } from "../composable/useCreateEntity";

onMounted(async () => await refetch());

const { notify } = useNotificationHandler();

const {
  data: classes,
  error: fetchError,
  showSpinner,
  refetch,
} = useFetch<Class[]>("classes");

const {
  error: deleteError,
  deleteItem,
  handleConfirmation,
  isShowModalConfirm,
} = useDeleteEntity<Class>("classes");

async function handleDelete() {
  console.log(classes.value);
  await deleteItem();
  await refetch();
}

const { isShowModalCreate } = useCreateEntity();

async function handleCreateClass() {
  isShowModalCreate.value = false;
  await refetch();
}

watch([fetchError, deleteError], () =>
  notify("error", "Ошибка загрузки странички")
);

function goToProfile(groupId: number | string) {
  router.push({ name: "class-profile", params: { id: groupId } });
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
          <tr
            v-for="group in classes"
            :key="group.id"
            class="row"
            @click="goToProfile(group.id)"
          >
            <td>{{ group.attributes.name }}</td>
            <td>{{ group.attributes.teacher?.data?.attributes?.name }}</td>
            <td>{{}}</td>
            <td>{{ group.attributes.description }}</td>
            <td>
              <n-button type="primary" ghost @click="goToProfile(group.id)"
                >Редактировать группу</n-button
              >
            </td>
            <td>
              <n-button
                type="error"
                ghost
                @click.stop="handleConfirmation(group.id)"
                >Удалить</n-button
              >
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
    <n-modal v-model:show="isShowModalCreate" @close-modal="handleCreateClass">
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
.row:hover > td {
  cursor: pointer;
  background-color: rgba(24, 160, 88, 0.1);
}
</style>
