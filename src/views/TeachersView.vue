<script setup lang="ts">
import { Teacher } from "../types/TeachersTypes.ts";
import { useFetchPage } from "../composable/useFetchPage";
import { useDeleteEntity } from "../composable/useDeleteEntity";
import { useCreateEntity } from "../composable/useCreateEntity";
import { watch } from "vue";
import { useNotificationHandler } from "../composable/useNotification";
import TeacherForm from "../components/TeacherForm.vue";

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

const {
  entities: teachers,
  error: fetchError,
  showSpinner,
  fetchPage,
} = useFetchPage<Teacher>("teachers");

const {
  error: deleteError,
  showConfirmation,
  deleteItem,
  isShowModalConfirm,
} = useDeleteEntity<Teacher>("teachers");

const { notify } = useNotificationHandler();

watch([fetchError, deleteError], () => notify("error"));

const { isShowModalCreate } = useCreateEntity();

async function handleDeleteTeacher() {
  await deleteItem();
  await fetchPage();
}
async function handleCreateTeacher() {
  isShowModalCreate.value = false;
  await fetchPage();
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
            <!-- <td>{{ teacher.attributes.class.data.attributes.name }}</td> -->
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
              <n-button @click="showConfirmation(teacher.id)">Удалить</n-button>
            </td>
            <td>
              <n-button>Изменить</n-button>
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
