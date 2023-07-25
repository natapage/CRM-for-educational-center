<script setup lang="ts">
import { Lesson, LessonsResponse } from "../types/LessonsTypes";
import { ref, computed, onMounted, watch } from "vue";
import {
  NList,
  NThing,
  NListItem,
  NButton,
  NSpace,
  NInput,
  NSelect,
  NSpin,
} from "naive-ui";
import { useRoute } from "vue-router";
import router from "../router/router";
import { useFetch } from "../composable/useFetch";
import { useEditEntity } from "../composable/useEditEntity";
import { useNotificationHandler } from "../composable/useNotification";

onMounted(async () => {
  await refetchLesson();
});

const { notify } = useNotificationHandler();

const route = useRoute();

const lessonId = ref<number>(Number(route.params.id));

const isEditing = ref<boolean>(false);
const nameToCreate = ref<string | undefined>("");
const descriptionToCreate = ref<string | undefined>("");
const durationToCreate = ref<string | undefined | number>("");

const {
  data: lesson,
  refetch: refetchLesson,
  showSpinner,
  error: refetchLessonError,
} = useFetch<Lesson>(`lessons/${lessonId.value}`);

const { error: editLessonError, editItem } = useEditEntity<
  LessonsResponse,
  Lesson
>(`classes/${lessonId.value}`);

function setEditMode() {
  isEditing.value = true;
  nameToCreate.value = lesson.value?.attributes.name;
  descriptionToCreate.value = lesson.value?.attributes.description;
  durationToCreate.value = lesson.value?.attributes?.duration;
}

async function handleEditLesson() {
  const body: any = {
    name: nameToCreate.value,
    description: descriptionToCreate.value,
    duration: durationToCreate.value,
  };

  await editItem(body);
  if (!editLessonError.value) {
    notify("success", "Группа успешно отредактирована");
  }
  if (editLessonError.value) {
    notify("error", "Невозможно отредактировать группу");
  }
  refetchLesson();
  isEditing.value = false;
  router.push(`/lessons`);
}
</script>

<template>
  <div class="container">
    <n-button type="tertiary" @click="router.push({ name: 'lessons' })"
      >Назад</n-button
    >
    <n-space horizontal justify="space-between" align="center">
      <h2>Данные об уроке</h2>
      <n-button
        type="primary"
        @click="setEditMode"
        v-if="!isEditing && !showSpinner"
      >
        Редактировать данные</n-button
      >
      <n-space horizontal v-else>
        <n-button v-if="!showSpinner" @click="isEditing = false">
          Отменить изменения</n-button
        >
        <n-button v-if="!showSpinner" type="primary" @click="handleEditLesson">
          Сохранить изменения</n-button
        >
      </n-space>
    </n-space>
    <div class="spinner-container" v-if="showSpinner">
      <n-spin size="medium" />
    </div>
    <n-list v-if="!showSpinner">
      <n-list-item>
        <n-thing title="Название урока">
          <div v-if="!isEditing">{{ lesson?.attributes.name }}</div>
          <n-input v-else v-model:value="nameToCreate" type="text" />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Описание урока">
          <div v-if="!isEditing">{{ lesson?.attributes.description }}</div>
          <n-input v-else v-model:value="descriptionToCreate" type="text" />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Продолжительность урока в минутах">
          <div v-if="!isEditing">{{ lesson?.attributes.duration }}</div>
          <n-input v-else v-model:value="durationToCreate" />
        </n-thing>
      </n-list-item>
    </n-list>
  </div>
</template>

<style scoped>
.card {
  text-align: left;
}
.container {
  width: 900px;
}
</style>
