<script setup lang="ts">
import { Student } from "../types/StudentsTypes.ts";
import { StudentsResponse } from "../types/StudentsTypes";

import { useFetch } from "../composable/useFetch";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { NList, NThing, NListItem, NButton, NSpace, NInput } from "naive-ui";
import { useEditEntity } from "../composable/useEditEntity";

const route = useRoute();
const studentId = ref<number>();
studentId.value = Number(route.params.id);
const isEditing = ref<boolean>(false);
const nameToCreate = ref("");
const phoneToCreate = ref("");
const dateToCreate = ref("");
const descriptionToCreate = ref("");
const classToCreate = ref("");

const {
  data: student,
  // error: fetchError,
  // fetchPage,
} = useFetch<Student>(`students/${studentId.value}`);

const {
  // // error: editError,
  editItem,
  // data: updatedStudent,
} = useEditEntity<Student>(`students/${studentId.value}`);

function formatBirthDate(date: string | undefined) {
  if (!date) return "";
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Date(date).toLocaleDateString("ru-RU", options);
}
async function handleEditEntity() {
  const body = {
    name: nameToCreate.value,
    date: new Date(dateToCreate.value ?? 0),
    phone: phoneToCreate.value,
    description: descriptionToCreate.value,
    // class: {
    //   connect: [classToCreate.value],
    // },
  };
  // TODO: изменить тип unknown
  await editItem<StudentsResponse, unknown>(body);
  //   if (!createError.value) {
  //     notify("success");
  //   }
  //   emit("close-modal");
  // } else {
  //   console.log(errors);
  //   notify("error");
  // }
}

function handleCancel() {
  isEditing.value = false;
  // скинуть значения инпутов
}
</script>

<template>
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
  <div class="container">
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
            v-model:value="dateToCreate"
            type="date"
            :placeholder="formatBirthDate(student?.attributes.date)"
          />

          <n-input v-if="isEditing" v-model:value="value" type="text" />
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
          <n-input
            v-if="isEditing"
            v-model:value="classToCreate"
            type="text"
            :placeholder="(student?.attributes.class.data.attributes.name as string)"
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
