<script setup lang="ts">
import TeacherForm from "../components/TeacherForm.vue";
import { Teacher } from "../types/TeachersTypes.ts";
import { Task } from "../types/TasksTypes";
import { BASE } from "../constants/constаnts.ts";
import router from "../router/router.ts";
import { watch, onMounted, h, computed } from "vue";
import {
  NTable,
  NAvatar,
  NDataTable,
  NButton,
  NModal,
  NCollapse,
  NCollapseItem,
  NSpin,
  NSpace,
  NCheckbox,
  DataTableColumns,
} from "naive-ui";
import { deleteEntity } from "../API/requestsApi";
import { useFetch } from "../composable/useFetch";
import { useDeleteEntity } from "../composable/useDeleteEntity";
import { useCreateEntity } from "../composable/useCreateEntity";
import { useNotificationHandler } from "../composable/useNotification";
// import { getPhoto } from "../API/requestsApi";

onMounted(async () => await refetch());

const { notify } = useNotificationHandler();

const {
  data: teachers,
  error: fetchError,
  showSpinner,
  refetch,
} = useFetch<Teacher[]>("teachers");

const {
  error: deleteTeacherError,
  handleConfirmation,
  deleteItem: deleteTeacher,
  isShowModalConfirm,
} = useDeleteEntity<Teacher>("teachers");

async function handleDeleteTeacher() {
  await deleteTeacher();
  await refetch();
}

const { isShowModalCreate } = useCreateEntity();

async function handleCreateTeacher() {
  isShowModalCreate.value = false;
  await refetch();
}

watch([fetchError, deleteTeacherError], () =>
  notify("error", "Ошибка загрузки страницы")
);

async function updateTaskList(taskId: number) {
  const url = `${BASE}/api/tasks/${taskId}`;
  await deleteEntity<Task>(url);
  setTimeout(refetch, 1000);
}

function goToProfile(teacherID: number | string) {
  router.push({ name: "teacher-profile", params: { id: teacherID } });
}

// const columns = computed(() =>
//   createColumns({ goToProfile, handleConfirmation })
// );

// const createColumns = ({
//   goToProfile,
//   handleConfirmation,
// }): DataTableColumns<Teacher> => [
//   {
//     title: "Имя педагога",
//     key: "name",
//   },
//   {
//     title: "Номер телефона",
//     key: "phone",
//   },
//   // {
//   //   title: "Группа",
//   //   key: "classes",
//   // },
//   // {
//   //   title: "Задачи",
//   //   key: "tasks",
//   // },
//   // {
//   //   title: "Фото",
//   //   key: "photo",
//   //   render(row) {
//   //     return h("img", {
//   //       src: row.attributes.photo,
//   //     });
//   //   },
//   // },
//   {
//     title: "",
//     key: "actions",
//     render(row) {
//       return h(NSpace, {}, () => [
//         h(
//           NButton,
//           {
//             type: "primary",
//             ghost: true,
//             onClick: () => goToProfile(row.id),
//           },
//           () => "Перейти в профиль"
//         ),
//         h(
//           NButton,
//           {
//             type: "error",
//             ghost: true,
//             onClick: () => handleConfirmation(),
//           },
//           () => "Удалить"
//         ),
//       ]);
//     },
//   },
// ];

// const data: Teacher[] = computed(async () => {
//   return teachers.value?.map((teacher) => {
//     // let photoUrl: string = "";
//     console.log(teacher.attributes.photo);
//     // if (teacher.attributes.photo) {
//     //   const blobData = teacher.attributes.photo; // Здесь должен быть Blob-объект с данными изображения
//     //   photoUrl = URL.createObjectURL(blobData);
//     // }
//     return {
//       id: teacher.id,
//       name: teacher.attributes.name,
//       phone: teacher.attributes.phone,
//       // classes: "группы",
//       // tasks: "задачи",
//       // photo: photoUrl,
//     };
//   });
// });
</script>
<template>
  <div>
    <n-space vertical>
      <h2>Список учителей</h2>
      <!-- <n-data-table
        :loading="showSpinner"
        :columns="columns"
        :data="data"
        :bordered="false"
        :max-height="400"
        virtual-scroll
      /> -->
      <n-table :bordered="false" :single-line="false">
        <thead>
          <tr>
            <th>Имя учителя</th>
            <th>Номер телефона</th>
            <th>Группа</th>
            <th>Задачи</th>
            <th>Фото</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="teacher in teachers"
            :key="teacher.id"
            class="row"
            @click="goToProfile(teacher.id)"
          >
            <td>{{ teacher.attributes.name }}</td>
            <td>{{ teacher.attributes.phone }}</td>
            <td>
              {{ teacher.attributes?.classes?.data[0]?.attributes?.name }}
            </td>
            <td width="200px">
              <div v-if="teacher.attributes.tasks.data.length === 0">
                нет задач
              </div>
              <div v-else @click.stop>
                <n-collapse>
                  <n-collapse-item title="Задачи" name="1">
                    <n-space item-style="display: flex;">
                      <n-checkbox
                        v-for="task in teacher.attributes.tasks.data"
                        :key="task.id"
                        :value="task.attributes.description"
                        @update:checked="updateTaskList(task.id)"
                      >
                        {{ task.attributes.description }}
                      </n-checkbox>
                    </n-space>
                  </n-collapse-item>
                </n-collapse>
              </div>
            </td>
            <td>
              <n-avatar
                round
                size="large"
                v-if="teacher.attributes.photo?.data[0].attributes.url"
                :src="
                  'http://localhost:1337' +
                  teacher.attributes.photo?.data[0].attributes.formats.thumbnail
                    .url
                "
              />
            </td>
            <td>
              <n-button type="primary" ghost @click="goToProfile(teacher.id)"
                >Перейти в профиль</n-button
              >
            </td>
            <td>
              <n-button
                type="error"
                ghost
                @click.stop="handleConfirmation(teacher.id)"
                >Удалить</n-button
              >
            </td>
          </tr>
        </tbody>
      </n-table>
      <n-button
        class="add-button"
        type="primary"
        @click="isShowModalCreate = true"
        v-if="!showSpinner"
      >
        Добавить учителя
      </n-button>
      <div class="spinner-container" v-if="showSpinner">
        <n-spin size="medium" />
      </div>
      <n-modal
        v-model:show="isShowModalConfirm"
        preset="dialog"
        title="Подтвердите удаление"
        content="Уверены что хотите удалить этого учителя?"
        positive-text="Удалить"
        negative-text="Отмена"
        @positive-click="handleDeleteTeacher"
        @negative-click="isShowModalConfirm = false"
      />
    </n-space>
    <n-modal
      v-model:show="isShowModalCreate"
      @close-modal="handleCreateTeacher"
    >
      <teacher-form :teachers="teachers"></teacher-form>
    </n-modal>
  </div>
</template>

<style scoped>
.spinner-container {
  margin-top: 20px;
}
.row:hover > td {
  cursor: pointer;
  background-color: rgba(24, 160, 88, 0.1);
}
</style>
