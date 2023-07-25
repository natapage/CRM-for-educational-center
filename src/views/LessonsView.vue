<script setup lang="ts">
import LessonForm from "../components/LessonForm.vue";
import { Lesson } from "../types/LessonsTypes.ts";
import { watch, onMounted } from "vue";
import router from "../router/router";
import { NTable, NButton, NSpace, NModal, NSpin } from "naive-ui";
import { useFetch } from "../composable/useFetch";
import { useNotificationHandler } from "../composable/useNotification";
import { useDeleteEntity } from "../composable/useDeleteEntity";
import { useCreateEntity } from "../composable/useCreateEntity";

onMounted(async () => await refetch());

const { notify } = useNotificationHandler();

const {
  data: lessons,
  error: fetchError,
  showSpinner,
  refetch,
} = useFetch<Lesson[]>("lessons");

const {
  error: deleteError,
  deleteItem,
  handleConfirmation,
  isShowModalConfirm,
} = useDeleteEntity<Lesson>("classes");

async function handleDelete() {
  console.log(lessons.value);
  await deleteItem();
  await refetch();
}

const { isShowModalCreate } = useCreateEntity();

async function handleCreateLesson() {
  isShowModalCreate.value = false;
  await refetch();
}

watch([fetchError, deleteError], () =>
  notify("error", "Ошибка загрузки странички")
);

function goToProfile(lessonId: number | string) {
  router.push({ name: "lesson-profile", params: { id: lessonId } });
}
</script>

<template>
  <div>
    <n-space align="stretch" vertical>
      <h2>Список уроков</h2>
      <n-table :bordered="false" :single-line="false" full-width>
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Продолжительность</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="lesson in lessons"
            :key="lesson.id"
            class="row"
            @click="goToProfile(lesson.id)"
          >
            <td>{{ lesson.attributes.name }}</td>
            <td>{{ lesson.attributes.description }}</td>
            <td>{{ lesson.attributes.duration }}</td>
            <td>
              <n-button type="primary" ghost @click="goToProfile(lesson.id)"
                >Редактировать урок</n-button
              >
            </td>
            <td>
              <n-button
                type="error"
                ghost
                @click.stop="handleConfirmation(lesson.id)"
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
        Добавить урок
      </n-button>
    </n-space>
    <n-modal v-model:show="isShowModalCreate" @close-modal="handleCreateLesson">
      <lesson-form></lesson-form>
    </n-modal>
    <n-modal
      v-model:show="isShowModalConfirm"
      preset="dialog"
      title="Подтвердите удаление"
      content="Уверены что хотите удалить этот урок?"
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
