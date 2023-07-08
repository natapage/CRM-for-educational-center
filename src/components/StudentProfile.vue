<script setup lang="ts">
import { Student } from "../types/StudentsTypes.ts";
import { Class } from "../types/ClassesTypes.ts";
import { StudentsResponse } from "../types/StudentsTypes";
import { ref, computed } from "vue";
import {
  NList,
  NThing,
  NListItem,
  NButton,
  NSpace,
  NInput,
  NDatePicker,
  NSelect,
} from "naive-ui";
import { useRoute } from "vue-router";
import { useFetch } from "../composable/useFetch";
import { useEditEntity } from "../composable/useEditEntity";
import { useNotificationHandler } from "../composable/useNotification";

const { notify } = useNotificationHandler();

const route = useRoute();

const studentId = ref<number>();
studentId.value = Number(route.params.id);

const isEditing = ref<boolean>(false);
const nameToCreate = ref("");
const phoneToCreate = ref("");
const dateToCreate = ref();
const descriptionToCreate = ref("");
const classToCreate = ref("");

const { data: classes } = useFetch<Class[]>("classes");

const classOptionsList = computed(() =>
  classes.value?.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }))
);

const { data: student, refetch } = useFetch<Student>(
  `students/${studentId.value}`
);

function formatBirthDate(date: string | undefined) {
  if (!date) return "";
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Date(date).toLocaleDateString("ru-RU", options);
}

const {
  error: editError,
  editItem,
  // data: updatedStudent,
} = useEditEntity<Student>(`students/${studentId.value}`);

async function handleEditEntity() {
  const body: any = {
    name: nameToCreate.value || student.value?.attributes.name,
    date: new Date((dateToCreate.value ?? 0) || student.value?.attributes.date),
    phone: phoneToCreate.value || student.value?.attributes.phone,
    description:
      descriptionToCreate.value || student.value?.attributes.description,
  };
  if (classToCreate.value) {
    body.class = {
      connect: [classToCreate.value],
    };
  }
  // TODO: изменить тип unknown
  await editItem<StudentsResponse, unknown>(body);
  if (!editError.value) {
    notify("success");
  }
  if (editError.value) {
    notify("error");
  }
  refetch();
  isEditing.value = false;
}

function handleCancel() {
  isEditing.value = false;
}
</script>

<template>
  <div class="container">
    <NSpace horizontal justify="space-between" align="center">
      <h2>Данные об ученике</h2>
      <NButton type="primary" @click="isEditing = true" v-if="!isEditing">
        Редактировать данные</NButton
      >
      <NSpace horizontal v-if="isEditing">
        <NButton @click="handleCancel"> Отменить изменения</NButton>
        <NButton type="primary" @click="handleEditEntity">
          Сохранить изменения</NButton
        >
      </NSpace>
    </NSpace>
    <n-list>
      <n-list-item>
        <n-thing title="Имя ученика">
          <div v-if="!isEditing">{{ student?.attributes.name }}</div>
          <n-input
            v-if="isEditing"
            v-model:value="nameToCreate"
            type="text"
            :placeholder="student?.attributes.name"
          />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Дата рождения ученика">
          <div v-if="!isEditing">
            {{ formatBirthDate(student?.attributes.date) }}
          </div>
          <n-date-picker
            v-if="isEditing"
            v-model:value="dateToCreate"
            type="date"
            :placeholder="formatBirthDate(student?.attributes.date)"
          />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Номер телефона">
          <div v-if="!isEditing">{{ student?.attributes.phone }}</div>
          <n-input
            v-if="isEditing"
            v-model:value="phoneToCreate"
            type="text"
            :placeholder="student?.attributes.phone"
          />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Группа">
          <div v-if="!isEditing">
            {{ student?.attributes.class.data.attributes.name }}
          </div>
          <n-select
            v-if="isEditing"
            v-model:value="classToCreate"
            :options="classOptionsList"
            filterable
            tag
          />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Особоая информация">
          <div v-if="!isEditing">{{ student?.attributes.description }}</div>
          <n-input
            v-if="isEditing"
            v-model:value="descriptionToCreate"
            type="text"
            :placeholder="student?.attributes.description"
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
