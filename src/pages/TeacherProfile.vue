<script setup lang="ts">
import { Teacher } from "../types/TeachersTypes";
import { Class } from "../types/ClassesTypes";
import { TeachersResponse } from "../types/TeachersTypes";
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
import { useFetch } from "../composable/useFetch";
import { useEditEntity } from "../composable/useEditEntity";
import { useNotificationHandler } from "../composable/useNotification";

onMounted(() => refetch());
const { notify, toCreateNotification } = useNotificationHandler();

const route = useRoute();

const teacherId = ref<number>(Number(route.params.id));

const isEditing = ref<boolean>(false);
const nameToCreate = ref("");
const phoneToCreate = ref("");
const classToCreate = ref("");

const { data: classes } = useFetch<Class[]>("classes");

const classOptionsList = computed(() =>
  classes.value?.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }))
);

const { data: teacher, refetch } = useFetch<Teacher>(
  `teachers/${teacherId.value}`
);

const { error: editError, editItem } = useEditEntity<Teacher>(
  `teachers/${teacherId.value}`
);

async function handleEditTeacher() {
  const body: any = {
    name: nameToCreate.value || teacher.value?.attributes.name,
    phone: phoneToCreate.value || teacher.value?.attributes.phone,
  };
  if (classToCreate.value) {
    body.class = {
      connect: [classToCreate.value],
    };
  }
  // TODO: изменить тип unknown
  await editItem<TeachersResponse, unknown>(body);
  if (!editError.value) {
    toCreateNotification.create({
      type: "success",
      content: "Успешно отредактировано",
      meta: "Данные педагога изменены",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
  if (editError.value) {
    notify("error");
  }
  refetch();
  isEditing.value = false;
}
</script>

<template>
  <div class="container">
    <n-space horizontal justify="space-between" align="center">
      <h2>Данные о педагоге</h2>
      <n-button type="primary" @click="isEditing = true" v-if="!isEditing">
        Редактировать данные</n-button
      >
      <n-space horizontal v-else>
        <n-button @click="isEditing = false"> Отменить изменения</n-button>
        <n-button type="primary" @click="handleEditTeacher">
          Сохранить изменения</n-button
        >
      </n-space>
    </n-space>
    <n-list>
      <n-list-item>
        <n-thing title="Имя ученика">
          <div v-if="!isEditing">{{ teacher?.attributes.name }}</div>
          <n-input
            v-else
            v-model:value="nameToCreate"
            type="text"
            :placeholder="teacher?.attributes.name"
          />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Номер телефона">
          <div v-if="!isEditing">{{ teacher?.attributes.phone }}</div>
          <n-input
            v-else
            v-model:value="phoneToCreate"
            type="text"
            :placeholder="teacher?.attributes.phone"
          />
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="Группа">
          <div v-if="!isEditing">
            {{ teacher?.attributes.classes.data[0].attributes.name }}
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
