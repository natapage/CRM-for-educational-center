<script setup lang="ts">
import { Teacher } from "../types/TeachersTypes.ts";
import { ref, onMounted } from "vue";
import { getTeachersWithEntities, deleteTeacher } from "../API/TeachersApi";

import {
  useNotification,
  NotificationType,
  NTable,
  NButton,
  NModal,
  NCollapse,
  NCollapseItem,
  NSpin,
  NSpace,
  NCheckbox,
} from "naive-ui";

const teachers = ref<Teacher[]>([]);
const showSpinner = ref<boolean>(false);
const teacherIdToDelete = ref<number>();
const showModalConfirm = ref<boolean>(false);
// const tasks = ref<Task[]>([]);

async function fetchPage() {
  showSpinner.value = true;
  try {
    const response = await getTeachersWithEntities();
    showSpinner.value = false;
    if (response) {
      console.log(response);
      teachers.value = response.data;
    } else {
      teachers.value = [];
    }
  } catch (error) {
    console.log(error);
    notify("error");
    showSpinner.value = false;
    teachers.value = [];
  }
}

// async function getTasks() {
//   try {
//     const response = await getTasksWithEntities();
//     if (response) {
//       tasks.value = response.data;
//       console.log(tasks.value);
//     } else {
//       tasks.value = [];
//     }
//   } catch (error) {
//     console.log(error);
//     notify("error");
//     tasks.value = [];
//   }
// }

const notification = useNotification();
const notify = (type: NotificationType) => {
  if (type === "error") {
    return notification[type]({
      content: "Ошибка при загрузке страницы",
      meta: "попробуйте снова",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
  if (type === "success") {
    return notification[type]({
      content: "Новый учитель успешно добавлен",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
};

async function handleConfirmation(id: number) {
  showModalConfirm.value = true;
  teacherIdToDelete.value = id;
}

async function handleDeleteTeacher() {
  const id = teacherIdToDelete.value as number;
  await deleteTeacher(id);
  await fetchPage();
}

onMounted(() => {
  fetchPage();
  // getTasks();
});
</script>
<template>
  <div>
    <n-space vertical>
      <h2>Список учителей</h2>
      <n-table :bordered="false" :single-line="false">
        <thead>
          <tr>
            <th>Имя учителя</th>
            <th>Номер телефона</th>
            <th>Группа</th>
            <th>Задачи</th>
            <th>Фото</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="teacher in teachers" :key="teacher.id">
            <td>{{ teacher.attributes.name }}</td>
            <td>{{ teacher.attributes.phone }}</td>
            <td>{{ teacher.attributes.class.data.attributes.name }}</td>
            <td width="200px">
              <div v-if="teacher.attributes.tasks.data.length === 0">
                нет задач
              </div>
              <n-collapse v-if="teacher.attributes.tasks.data.length !== 0">
                <n-collapse-item title="Задачи" name="1">
                  <n-space item-style="display: flex;">
                    <n-checkbox
                      v-for="task in teacher.attributes.tasks.data"
                      :key="teacher.id"
                      :value="task.attributes.description"
                    >
                      {{ task.attributes.description }}
                    </n-checkbox>
                  </n-space>
                </n-collapse-item>
              </n-collapse>
            </td>
            <td>фото</td>
            <td>
              <n-button @click="handleConfirmation(teacher.id)"
                >Удалить</n-button
              >
            </td>
          </tr>
        </tbody>
      </n-table>
      <n-button class="add-button" type="primary" v-if="!showSpinner">
        Добавить учителя
      </n-button>
      <div class="spinner-container" v-if="showSpinner">
        <n-spin size="medium" />
      </div>
      <n-modal
        v-model:show="showModalConfirm"
        preset="dialog"
        title="Подтвердите удаление"
        content="Уверены что хотите удалить этого учителя?"
        positive-text="Удалить"
        negative-text="Отмена"
        @positive-click="handleDeleteTeacher"
        @negative-click="showModalConfirm = false"
      />
    </n-space>
  </div>
</template>

<style scoped>
.spinner-container {
  margin-top: 20px;
}
</style>
