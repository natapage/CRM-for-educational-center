<script setup lang="ts">
import { watch, ref, computed, onMounted } from "vue";

import {
  NButton,
  FormItemRule,
  FormInst,
  NGradientText,
  NInput,
  NFormItem,
  NForm,
  NSelect,
} from "naive-ui";
import { Class } from "../types/ClassesTypes.ts";
import { useFetch } from "../composable/useFetch";
import { useCreateEntity } from "../composable/useCreateEntity";
import { useNotificationHandler } from "../composable/useNotification";

const { error: createError, createItem } = useCreateEntity();
const {
  data: classes,
  refetch: refetchClasses,
  error: refetchClassesError,
} = useFetch<Class[]>("classes");

const { notify } = useNotificationHandler();
const formRef = ref<FormInst | null>(null);

const emit = defineEmits<{
  (e: "close-modal"): void;
}>();

onMounted(async () => await refetchClasses());

watch(createError, () => notify("error", "Ошибка добавления нового учителя"));
watch([refetchClassesError], () =>
  notify("error", "Ошибка при загрузке страницы")
);

const model = ref({
  teacherName: null,
  teacherPhone: null,
  teacherClass: null,
});

const rules = {
  teacherName: {
    required: true,
    trigger: ["blur", "input"],
    message: "Пожалуйста, введите имя",
  },
  teacherPhone: {
    required: true,
    trigger: ["blur", "input"],
    message: "Пожалуйста, введите номер из 11 цифр",
    validator: (rule: FormItemRule, value: string) => {
      console.log(rule);
      return /^(\+)?\d{11}$/.test(value);
    },
  },
  teacherClass: {
    message: "Пожалуйста, выберете группу",
  },
};

const classOptionsList = computed(() => {
  const classesWithoutTeachers = classes.value?.filter(
    (item) => !item.attributes?.teacher?.data
  );

  return classesWithoutTeachers?.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }));
});

function handleCreateTeacher(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      console.log(model.value.teacherClass);
      const body: any = {
        name: model.value.teacherName,
        phone: model.value.teacherPhone,
      };
      if (model.value.teacherClass) {
        body.classes = {
          connect: [model.value.teacherClass],
        };
      }
      await createItem(body, "teachers");

      if (!createError.value) {
        notify("success", "Учитель успешно добавлен");
      }
    }
    emit("close-modal");
  });
}
</script>

<template>
  <div class="container">
    <n-gradient-text v-if="classOptionsList?.length === 0">
      У всех групп уже есть педагоги. Добавьте, пожалуйста, новую
      группу.</n-gradient-text
    >
    <n-form
      v-else
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
      <n-form-item label="ФИО педагога" path="teacherName">
        <n-input
          v-model:value="model.teacherName"
          placeholder="Введите фамилию, имя и отчество"
        />
      </n-form-item>

      <n-form-item label="Номер телефона" path="teacherPhone">
        <n-input
          v-model:value="model.teacherPhone"
          placeholder="Введите номер"
        />
      </n-form-item>
      <n-form-item label="Группа" path="teacherClass">
        <n-select
          v-model:value="model.teacherClass"
          placeholder="Выберете группу"
          :options="classOptionsList"
        />
      </n-form-item>
    </n-form>
    <n-button
      v-if="classOptionsList?.length !== 0"
      round
      :disabled="model.teacherName === null || model.teacherPhone === null"
      class="add-button"
      @click="handleCreateTeacher"
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
