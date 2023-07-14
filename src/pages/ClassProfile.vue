<script setup lang="ts">
import { Teacher } from "../types/TeachersTypes";
import { Class, ClassesResponse } from "../types/ClassesTypes";
import { ref, computed, onMounted } from "vue";
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
const { notify, toCreateNotification } = useNotificationHandler();

const route = useRoute();

const classId = ref<number>(Number(route.params.id));

const isEditing = ref<boolean>(false);
const nameToCreate = ref("");
const descriptionToCreate = ref("");
const teacherToCreate = ref("");

const { data: teachers, refetch: refetchTeacher } =
  useFetch<Teacher[]>("teachers");

const teachersOptionsList = computed(() => {
  return teachers.value?.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }));
});

const { data: classItem, refetch: refetchClass } = useFetch<Class>(
  `classes/${classId.value}`
);

const { error: editError, editItem } = useEditEntity<Class>(
  `classes/${classId.value}`
);

async function handleEditClass() {
  const body: any = {
    name: nameToCreate.value || classItem.value?.attributes.name,
    description:
      descriptionToCreate.value || classItem.value?.attributes.description,
  };
  if (teacherToCreate.value) {
    body.teacher = {
      connect: [teacherToCreate.value],
    };
  }
  // TODO: изменить тип unknown
  await editItem<ClassesResponse, unknown>(body);
  if (!editError.value) {
    toCreateNotification.create({
      type: "success",
      content: "Успешно отредактировано",
      meta: "Данные группы изменены",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
  if (editError.value) {
    notify("error");
  }
  refetchClass();
  isEditing.value = false;
  router.push(`/classes`);
}
</script>

<template>
  <div class="container">
    <n-space horizontal justify="space-between" align="center">
      <h2>Данные об учебной группе</h2>
      <n-button type="primary" @click="isEditing = true" v-if="!isEditing">
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
          <n-input
            v-else
            v-model:value="nameToCreate"
            type="text"
            :placeholder="classItem?.attributes.name"
          />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Описание и рабочие задачи">
          <div v-if="!isEditing">{{ classItem?.attributes.description }}</div>
          <n-input
            v-else
            v-model:value="descriptionToCreate"
            type="text"
            :placeholder="classItem?.attributes.description"
          />
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
      <!-- <n-list-item>
        <n-button
          :disabled="!fileListLength"
          style="margin-bottom: 12px"
          @click="handleClick"
        >
          Upload File
        </n-button>
        <n-upload
          ref="upload"
          action="http://localhost:1337/api/upload"
          :default-upload="false"
          multiple
          @change="handleChange"
        >
          <n-button>Select File</n-button>
        </n-upload> -->
      <!-- <n-upload
          action="http://localhost:1337/api/upload"
          :headers="{ 'Content-Type': 'multipart/form-data' }"
        >
          <n-button>Загрузить фото педагога</n-button>
        </n-upload> -->
      <!-- </n-list-item> -->
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
