<script setup lang="ts">
import { Teacher } from "../types/TeachersTypes";
import { Class, ClassesResponse } from "../types/ClassesTypes";
import { ref, computed, onMounted, watch } from "vue";
import {
  NList,
  NThing,
  NListItem,
  NButton,
  NSpace,
  NInput,
  NSelect,
} from "naive-ui";
import { useRoute } from "vue-router";
import router from "../router/router.ts";
import { useFetch } from "../composable/useFetch";
import { useEditEntity } from "../composable/useEditEntity";
import { useNotificationHandler } from "../composable/useNotification";

onMounted(() => {
  refetchClass();
  refetchTeacher();
});

const { notify } = useNotificationHandler();

const route = useRoute();

const classId = ref<number>(Number(route.params.id));

const isEditing = ref<boolean>(false);
const nameToCreate = ref<string | undefined>("");
const descriptionToCreate = ref<string | undefined>("");
const teacherToCreate = ref<string | undefined | number>("");

const {
  data: teachers,
  refetch: refetchTeacher,
  error: refetchTeacherError,
} = useFetch<Teacher[]>("teachers");

const teachersOptionsList = computed(() => {
  return teachers.value?.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }));
});

const {
  data: classItem,
  refetch: refetchClass,
  error: refetchClassError,
} = useFetch<Class>(`classes/${classId.value}`);

const { error: editClassError, editItem } = useEditEntity<
  ClassesResponse,
  Class
>(`classes/${classId.value}`);

function setEditMode() {
  isEditing.value = true;
  nameToCreate.value = classItem.value?.attributes.name;
  descriptionToCreate.value = classItem.value?.attributes.description;
  teacherToCreate.value = classItem.value?.attributes?.teacher?.data?.id;
}

async function handleEditClass() {
  const body: any = {
    name: nameToCreate.value,
    description: descriptionToCreate.value,
  };
  if (teacherToCreate.value) {
    body.teacher = {
      connect: [teacherToCreate.value],
    };
  }

  await editItem(body);
  if (!editClassError.value) {
    notify("success", "Группа успешно отредактирована");
  }
  if (editClassError.value) {
    notify("error", "Невозможно отредактировать группу");
  }
  refetchClass();
  isEditing.value = false;
  router.push(`/classes`);
}

watch([refetchTeacherError, refetchClassError], () =>
  notify("error", "Ошибка загрузки страницы")
);
</script>

<template>
  <div class="container">
    <n-space horizontal justify="space-between" align="center">
      <h2>Данные об учебной группе</h2>
      <n-button type="primary" @click="setEditMode" v-if="!isEditing">
        Редактировать данные</n-button
      >
      <n-space horizontal v-else>
        <n-button @click="isEditing = false"> Отменить изменения</n-button>
        <n-button type="primary" @click="handleEditClass">
          Сохранить изменения</n-button
        >
      </n-space>
    </n-space>
    <n-list>
      <n-list-item>
        <n-thing title="Название учебной группы">
          <div v-if="!isEditing">{{ classItem?.attributes.name }}</div>
          <n-input v-else v-model:value="nameToCreate" type="text" />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Описание и рабочие задачи">
          <div v-if="!isEditing">{{ classItem?.attributes.description }}</div>
          <n-input v-else v-model:value="descriptionToCreate" type="text" />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Педагог">
          <div v-if="!isEditing">
            {{ classItem?.attributes?.teacher?.data.attributes?.name }}
          </div>
          <n-select
            v-else
            v-model:value="teacherToCreate"
            :options="teachersOptionsList"
            filterable
            tag
          />
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
