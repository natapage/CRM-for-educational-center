<script setup lang="ts">
import { Student } from "../types/StudentsTypes";
import { Class } from "../types/ClassesTypes";
import { StudentsResponse } from "../types/StudentsTypes";
import { ref, computed, onMounted, watch } from "vue";
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
import router from "../router/router.ts";
import { useFetch } from "../composable/useFetch";
import { useEditEntity } from "../composable/useEditEntity";
import { useNotificationHandler } from "../composable/useNotification";

onMounted(() => {
  refetchClasses();
  refetchStudent();
});

const { notify, toCreateNotification } = useNotificationHandler();

const route = useRoute();

const studentId = ref<number>(Number(route.params.id));

const isEditing = ref<boolean>(false);
const nameToCreate = ref("");
const phoneToCreate = ref("");
const dateToCreate = ref();
const descriptionToCreate = ref("");
const classToCreate = ref("");

const {
  data: classes,
  refetch: refetchClasses,
  error: refetchClassesError,
} = useFetch<Class[]>("classes");

const classOptionsList = computed(() =>
  classes.value?.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }))
);

const {
  data: student,
  refetch: refetchStudent,
  error: refetchStudentError,
} = useFetch<Student>(`students/${studentId.value}`);

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
} = useEditEntity<StudentsResponse, Student>(`students/${studentId.value}`);

async function handleEditStudent() {
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
  await editItem(body);
  if (!editError.value) {
    toCreateNotification.create({
      type: "success",
      content: "Успешно отредактировано",
      meta: "Данные ученика изменены",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
  if (editError.value) {
    notify("error");
  }
  refetchStudent();
  isEditing.value = false;
  router.push(`/students`);
}

watch([refetchClassesError, refetchStudentError], () => notify("error"));
</script>

<template>
  <div class="container">
    <n-space horizontal justify="space-between" align="center">
      <h2>Данные об ученике</h2>
      <n-button type="primary" @click="isEditing = true" v-if="!isEditing">
        Редактировать данные</n-button
      >
      <n-space horizontal v-else>
        <n-button @click="isEditing = false"> Отменить изменения</n-button>
        <n-button type="primary" @click="handleEditStudent">
          Сохранить изменения</n-button
        >
      </n-space>
    </n-space>
    <n-list>
      <n-list-item>
        <n-thing title="Имя ученика">
          <div v-if="!isEditing">{{ student?.attributes.name }}</div>
          <n-input
            v-else
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
            v-else
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
            v-else
            v-model:value="phoneToCreate"
            type="text"
            :placeholder="student?.attributes.phone"
          />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Группа">
          <div v-if="!isEditing">
            {{ student?.attributes.class?.data.attributes.name }}
          </div>
          <n-select
            v-else
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
            v-else
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
