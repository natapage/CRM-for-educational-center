<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { NButton, FormInst, NForm, NFormItem, NInput, NSelect } from "naive-ui";
import { Teacher } from "../types/TeachersTypes";
import { useCreateEntity } from "../composable/useCreateEntity";
import { useNotificationHandler } from "../composable/useNotification";
import { useFetch } from "../composable/useFetch";

onMounted(async () => {
  await refetchTeachers();
});

const emit = defineEmits<{
  (e: "close-modal"): void;
}>();

const { error: createError, createItem } = useCreateEntity();
const { notify } = useNotificationHandler();

const {
  data: teachers,
  refetch: refetchTeachers,
  error: refetchTeachersError,
} = useFetch<Teacher[]>("teachers");
const formRef = ref<FormInst | null>(null);

const teacherOptionsList = computed(() =>
  teachers.value?.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }))
);

const model = ref({
  className: null,
  classDescription: null,
  teacherName: null,
});

const rules = {
  className: {
    required: true,
    trigger: ["blur", "input"],
    message: "Пожалуйста, введите название",
  },
  classDescription: {
    trigger: ["blur", "input"],
    message: "Пожалуйста, опишите задачи и цели",
  },
  teacherName: {
    message: "Пожалуйста, выберете педагога",
  },
};

watch(createError, () => notify("error", "Ошибка добавления группы"));
watch([refetchTeachersError], () =>
  notify("error", "Ошибка загрузки странички")
);

function handleCreateClass(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const body: any = {
        name: model.value.className,
        description: model.value.classDescription,
      };

      if (model.value.teacherName) {
        body.teacher = {
          connect: [model.value.teacherName],
        };
      }
      await createItem(body, "classes");
      if (!createError.value) {
        notify("success", "Группа успешно добавлена");
      }
      emit("close-modal");
    }
  });
}
</script>

<template>
  <div class="container">
    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      require-mark-placement="right-hanging"
      label-width="auto"
      :style="{
        maxWidth: '640px',
      }"
    >
      <n-form-item label="Название группы" path="className">
        <n-input
          v-model:value="model.className"
          placeholder="Введите название группы"
        />
      </n-form-item>

      <n-form-item label="Описание группы" path="classDescription">
        <n-input
          v-model:value="model.classDescription"
          placeholder="Опишите цели и задачи"
          type="textarea"
          :autosize="{
            minRows: 3,
            maxRows: 5,
          }"
        />
      </n-form-item>
      <n-form-item label="Педагог" path="teacherName">
        <n-select
          v-model:value="model.teacherName"
          placeholder="Выберете педагога"
          :options="teacherOptionsList"
          filterable
          tag
        />
      </n-form-item>
    </n-form>
    <n-button
      round
      :disabled="model.className === null"
      class="add-button"
      @click="handleCreateClass"
      type="primary"
      >Создать</n-button
    >
  </div>
</template>

<style scoped>
.container {
  background-color: #ffffff;
  padding: 60px 120px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 400px; /* Set the width of the container */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.add-button {
  position: absolute;
  bottom: 20px;
  right: 120px;
}
</style>
