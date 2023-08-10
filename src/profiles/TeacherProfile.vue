<script setup lang="ts">
import { Class } from "../types/ClassesTypes";
import { Teacher, TeachersResponse } from "../types/TeachersTypes";
import { ref, computed, onMounted, watch } from "vue";
import {
  NList,
  NImage,
  NThing,
  NListItem,
  NButton,
  NSpace,
  NInput,
  NSelect,
  NSpin,
  NUpload,
} from "naive-ui";
import { useRoute } from "vue-router";
import router from "../router/router";
import { useFetch } from "../composable/useFetch";
import { useEditEntity } from "../composable/useEditEntity";
import { useNotificationHandler } from "../composable/useNotification";

onMounted(async () => {
  await refetchClasses();
  await refetchTeacher();
});

const { notify } = useNotificationHandler();

const route = useRoute();

const teacherId = ref<number>(Number(route.params.id));

const isEditing = ref<boolean>(false);
const nameToCreate = ref<string | undefined>();
const phoneToCreate = ref<string | undefined>();
const classToCreate = ref<string | number>("");

const {
  data: classes,
  refetch: refetchClasses,
  showSpinner,
  error: refetchClassesError,
} = useFetch<Class[]>("classes");

const classOptionsList = computed(() => {
  console.log(classes.value);

  return classes.value?.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }));
});

const {
  data: teacher,
  refetch: refetchTeacher,
  error: refetchTeacherError,
} = useFetch<Teacher>(`teachers/${teacherId.value}`);

const { error: editError, editItem } = useEditEntity<TeachersResponse, Teacher>(
  `teachers/${teacherId.value}`
);

async function handleEditTeacher() {
  const body: any = {
    name: nameToCreate.value,
    phone: phoneToCreate.value,
  };
  if (classToCreate.value) {
    body.class = {
      connect: [classToCreate.value],
    };
  }
  await editItem(body);
  if (!editError.value) {
    notify("success", "Данные педагога отредактированы");
  }
  if (editError.value) {
    notify("error", "Ошибка редактирования данных");
  }
  refetchTeacher();
  isEditing.value = false;
  router.push({ name: "teachers" });
}

function setEditMode() {
  if (!teacher.value) return;
  isEditing.value = true;
  nameToCreate.value = teacher.value.attributes.name;
  phoneToCreate.value = teacher.value.attributes.phone;
  classToCreate.value = teacher.value.attributes.classes.data[0].id;
}

watch([refetchClassesError, refetchTeacherError], () =>
  notify("error", "Ошибка загрущки странички")
);
</script>

<template>
  <div class="container">
    <n-button type="tertiary" @click="router.push({ name: 'teachers' })"
      >Назад</n-button
    >
    <n-space vertical>
      <h2>Данные о педагоге</h2>
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
        <n-button v-if="!showSpinner" type="primary" @click="handleEditTeacher">
          Сохранить изменения</n-button
        >
      </n-space>
    </n-space>
    <div class="spinner-container" v-if="showSpinner">
      <n-spin size="medium" />
    </div>
    <n-space justify="space-between">
      <n-list v-if="!showSpinner">
        <n-list-item>
          <n-thing title="Имя педагога">
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
        <n-list-item>
          <n-thing title="Фото">
            <n-space>
              <n-upload
                action="http://localhost:1337/api/upload/"
                :data="{
                  refId: teacherId.toString(),
                  field: 'photo',
                  ref: 'api::teacher.teacher',
                }"
                name="files"
                :show-file-list="false"
              >
                <n-button>Выбрать файл</n-button>
              </n-upload>
              <n-button @click="refetchTeacher" type="primary"
                >Загрузить фото</n-button
              >
            </n-space>
          </n-thing>
        </n-list-item>
      </n-list>
      <n-image
        v-if="teacher"
        width="300"
        height="300"
        :src="
          'http://localhost:1337' +
          teacher?.attributes.photo?.data?.attributes.formats.small.url
        "
      ></n-image>
    </n-space>
  </div>
</template>

<style scoped>
.card {
  text-align: left;
}
.container {
  width: 900px;
}
.teacher_info {
  flex: 1; /* Занимает все доступное пространство, оставшееся после фотографии */
  padding-left: 20px; /* Добавьте отступ слева для разделения от фотографии */
}

.profile_container {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Выравнивание по вертикали */
}

.teacher_photo {
  width: 300px; /* Задайте фиксированную ширину для фотографии */
  height: 300px; /* Задайте фиксированную высоту для фотографии */
}
</style>
