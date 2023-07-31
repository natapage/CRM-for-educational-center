<script setup lang="ts">
import ClassForm from "../components/ClassForm.vue";
import { Class } from "../types/ClassesTypes.ts";
import { watch, onMounted, h, computed } from "vue";
import router from "../router/router.ts";
import {
  NButton,
  NSpace,
  NModal,
  DataTableColumns,
  NDataTable,
} from "naive-ui";
import { useFetch } from "../composable/useFetch";
import { useNotificationHandler } from "../composable/useNotification";
import { useDeleteEntity } from "../composable/useDeleteEntity";
import { useCreateEntity } from "../composable/useCreateEntity";

onMounted(async () => {
  await refetch();
});

const { notify } = useNotificationHandler();

const {
  data: classes,
  error: fetchError,
  showSpinner,
  refetch,
} = useFetch<Class[]>("classes");

const {
  error: deleteError,
  deleteItem,
  handleConfirmation,
  isShowModalConfirm,
} = useDeleteEntity<Class>("classes");

async function handleDelete() {
  console.log(classes.value);
  await deleteItem();
  await refetch();
}

const { isShowModalCreate } = useCreateEntity();

async function handleCreateClass() {
  isShowModalCreate.value = false;
  await refetch();
}

watch([fetchError, deleteError], () =>
  notify("error", "Ошибка загрузки странички")
);

function goToProfile(groupId: number | string) {
  router.push({ name: "class-profile", params: { id: groupId } });
}

const columns = computed(() =>
  createColumns({ goToProfile, handleConfirmation })
);

const createColumns = ({
  goToProfile,
  handleConfirmation,
}): DataTableColumns<Class> => [
  {
    title: "Название",
    key: "name",
  },
  {
    title: "Педагог",
    key: "teacher",
  },
  {
    title: "Описание",
    key: "description",
  },
  {
    title: "",
    key: "actions",
    render(row) {
      return h(NSpace, {}, () => [
        h(
          NButton,
          {
            type: "primary",
            ghost: true,
            onClick: () => goToProfile(row.id),
          },
          () => "Перейти в профиль"
        ),
        h(
          NButton,
          {
            type: "error",
            ghost: true,
            onClick: () => handleConfirmation(row.id),
          },
          () => "Удалить"
        ),
      ]);
    },
  },
];

const data: ClassTable[] = computed(() => {
  return classes.value?.map((group) => {
    return {
      id: group.id,
      name: group.attributes.name,
      teacher: group.attributes.teacher?.data?.attributes?.name,
      description: group.attributes.description,
    };
  });
});
</script>

<template>
  <div>
    <n-space align="stretch" vertical>
      <h2>Список учебных групп</h2>
      <div class="table container">
        <n-data-table
          :loading="showSpinner"
          :columns="columns"
          :data="data"
          :bordered="false"
          :max-height="400"
          virtual-scroll
        />
      </div>
      <n-button
        class="add-button"
        type="primary"
        @click="isShowModalCreate = true"
        v-if="!showSpinner"
      >
        Добавить группу
      </n-button>
    </n-space>
    <n-modal v-model:show="isShowModalCreate" @close-modal="handleCreateClass">
      <class-form></class-form>
    </n-modal>
    <n-modal
      v-model:show="isShowModalConfirm"
      preset="dialog"
      title="Подтвердите удаление"
      content="Уверены что хотите удалить эту группу?"
      positive-text="Удалить"
      negative-text="Отмена"
      @positive-click="handleDelete"
      @negative-click="isShowModalConfirm = false"
    />
  </div>
</template>

<style scoped>
.row:hover > td {
  cursor: pointer;
  background-color: rgba(24, 160, 88, 0.1);
}
</style>
