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
  NSpin,
} from "naive-ui";
import { useRoute } from "vue-router";
import router from "../router/router";
import { useFetch } from "../composable/useFetch";
import { useEditEntity } from "../composable/useEditEntity";
import { useNotificationHandler } from "../composable/useNotification";

onMounted(async () => {
  await refetchClasses();
  await refetchStudent();
});

const { notify } = useNotificationHandler();

const route = useRoute();

const studentId = ref<number>(Number(route.params.id));

const isEditing = ref<boolean>(false);
const nameToCreate = ref<string | undefined>();
const phoneToCreate = ref<string | undefined>();
const dateToCreate = ref<Date>();
const descriptionToCreate = ref<string | undefined>();
const classToCreate = ref<string | number>();

const {
  data: classes,
  refetch: refetchClasses,
  showSpinner,
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

function dateDisabled(ts: number) {
  const date = new Date(ts);
  const targetDate = new Date(2020, 8, 1);
  return date > targetDate;
}

const { error: editError, editItem } = useEditEntity<StudentsResponse, Student>(
  `students/${studentId.value}`
);

async function handleEditStudent() {
  const body: any = {
    name: nameToCreate.value,
    date: new Date(dateToCreate.value ?? 0),
    phone: phoneToCreate.value,
    description: descriptionToCreate.value,
  };
  if (classToCreate.value) {
    body.class = {
      connect: [classToCreate.value],
    };
  }
  await editItem(body);
  if (!editError.value) {
    notify("success", "Данные ученика успешно изменены");
  }
  if (editError.value) {
    notify("error", "Ошибка редактирования данных");
  }
  refetchStudent();
  isEditing.value = false;
  router.push({ name: "students" });
}

watch([refetchClassesError, refetchStudentError], () =>
  notify("error", "Ошибка загрузки странички")
);

function setEditMode() {
  if (!student.value) return;
  isEditing.value = true;
  nameToCreate.value = student.value.attributes.name;
  phoneToCreate.value = student.value.attributes.phone;
  dateToCreate.value = new Date(student.value.attributes.date);
  descriptionToCreate.value = student.value.attributes.description;
  classToCreate.value = student.value.attributes.class?.data.id;
}
</script>

<template>
  <div class="container">
    <n-button type="tertiary" @click="router.push({ name: 'students' })"
      >Назад</n-button
    >
    <n-space horizontal justify="space-between" align="center">
      <h2>Данные об ученике</h2>
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
        <n-button v-if="!showSpinner" type="primary" @click="handleEditStudent">
          Сохранить изменения</n-button
        >
      </n-space>
    </n-space>
    <div class="spinner-container" v-if="showSpinner">
      <n-spin size="medium" />
    </div>
    <n-list v-if="!showSpinner">
      <n-list-item>
        <n-thing title="Имя ученика">
          <div v-if="!isEditing">{{ student?.attributes.name }}</div>
          <n-input v-else v-model:value="nameToCreate" type="text" />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Дата рождения ученика">
          <div v-if="!isEditing">
            {{ formatBirthDate(student?.attributes.date) }}
          </div>
          <n-date-picker
            v-else
            :is-date-disabled="dateDisabled"
            format="yyyy-MM-dd"
            v-model="dateToCreate"
            :default-formatted-value="student?.attributes.date"
            type="date"
          />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Номер телефона">
          <div v-if="!isEditing">{{ student?.attributes.phone }}</div>
          <n-input v-else v-model:value="phoneToCreate" type="text" />
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
          <n-input v-else v-model:value="descriptionToCreate" type="text" />
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
