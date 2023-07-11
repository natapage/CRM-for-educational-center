<script setup lang="ts">
import TeacherForm from "../components/TeacherForm.vue";
import { Teacher } from "../types/TeachersTypes.ts";
import router from "../router/router.ts";
import { watch, onMounted } from "vue";
import {
  NTable,
  NButton,
  NModal,
  NCollapse,
  NCollapseItem,
  NSpin,
  NSpace,
  NCheckbox,
} from "naive-ui";

import { useFetch } from "../composable/useFetch";
import { useDeleteEntity } from "../composable/useDeleteEntity";
import { useCreateEntity } from "../composable/useCreateEntity";
import { useNotificationHandler } from "../composable/useNotification";

onMounted(() => refetch());

const { notify } = useNotificationHandler();

const {
  data: teachers,
  error: fetchError,
  showSpinner,
  refetch,
} = useFetch<Teacher[]>("teachers");

const {
  error: deleteError,
  handleConfirmation,
  deleteItem,
  isShowModalConfirm,
} = useDeleteEntity<Teacher>("teachers");

async function handleDeleteTeacher() {
  await deleteItem();
  await refetch();
}

const { isShowModalCreate } = useCreateEntity();

async function handleCreateTeacher() {
  isShowModalCreate.value = false;
  await refetch();
}

watch([fetchError, deleteError], () => notify("error"));

function goToProfile(teacherID: number | string) {
  router.push(`/teachers/${teacherID}`);
}
</script>
<template>
  <div>
    <n-space vertical>
      <h2>Список учителей</h2>
      <n-table :bordered="false" :single-line="false">
        <thead>
          <tr>
            <th>Имя учителя</th>
            <th>Номер телефона</th>
            <th>Группа</th>
            <th>Задачи</th>
            <th>Фото</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="teacher in teachers" :key="teacher.id">
            <td>{{ teacher.attributes.name }}</td>
            <td>{{ teacher.attributes.phone }}</td>
            <td>
              {{ teacher.attributes?.classes?.data[0]?.attributes?.name }}
            </td>
            <td width="200px">
              <div v-if="teacher.attributes.tasks.data.length === 0">
                нет задач
              </div>
              <n-collapse v-if="teacher.attributes.tasks.data.length !== 0">
                <n-collapse-item title="Задачи" name="1">
                  <n-space item-style="display: flex;">
                    <n-checkbox
                      v-for="task in teacher.attributes.tasks.data"
                      :key="teacher.id"
                      :value="task.attributes.description"
                    >
                      {{ task.attributes.description }}
                    </n-checkbox>
                  </n-space>
                </n-collapse-item>
              </n-collapse>
            </td>
            <td>фото</td>
            <td>
              <n-button @click="goToProfile(teacher.id)"
                >Перейти в профиль</n-button
              >
            </td>
            <td>
              <n-button @click="handleConfirmation(teacher.id)"
                >Удалить</n-button
              >
            </td>
          </tr>
        </tbody>
      </n-table>
      <n-button
        class="add-button"
        type="primary"
        @click="isShowModalCreate = true"
        v-if="!showSpinner"
      >
        Добавить учителя
      </n-button>
      <div class="spinner-container" v-if="showSpinner">
        <n-spin size="medium" />
      </div>
      <n-modal
        v-model:show="isShowModalConfirm"
        preset="dialog"
        title="Подтвердите удаление"
        content="Уверены что хотите удалить этого учителя?"
        positive-text="Удалить"
        negative-text="Отмена"
        @positive-click="handleDeleteTeacher"
        @negative-click="isShowModalConfirm = false"
      />
    </n-space>
    <n-modal
      v-model:show="isShowModalCreate"
      @close-modal="handleCreateTeacher"
    >
      <teacher-form :teachers="teachers"></teacher-form>
    </n-modal>
  </div>
</template>

<style scoped>
.spinner-container {
  margin-top: 20px;
}
</style>
