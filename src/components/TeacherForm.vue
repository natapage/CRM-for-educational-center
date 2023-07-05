<script setup lang="ts">
import { watch, ref, computed } from "vue";

import {
  NButton,
  FormItemRule,
  FormInst,
  NUpload,
  NInput,
  NFormItem,
  NForm,
  NSelect,
} from "naive-ui";

import { TeachersResponse } from "../types/TeachersTypes";
import { Class } from "../types/ClassesTypes.ts";

import { useFetchPage } from "../composable/useFetchPage";
import { useCreateEntity } from "../composable/useCreateEntity";
import { useNotificationHandler } from "../composable/useNotification";

const { error: createError, createItem } = useCreateEntity();
const { entities: classes } = useFetchPage<Class>("classes");

const { notify } = useNotificationHandler();
const formRef = ref<FormInst | null>(null);

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

watch(createError, () => notify("error"));

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
    // required: true
    message: "Пожалуйста, выберете группу",
  },
};

const classOptionsList = computed(() =>
  classes.value.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }))
);

function handleCreateTeacher(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const body = {
        name: model.value.teacherName,
        phone: model.value.teacherPhone,
        class: {
          connect: [model.value.teacherClass],
        },
      };
      // TODO: изменить тип unknown
      await createItem<TeachersResponse, unknown>(body, "teachers");
    }
    if (!createError.value) {
      notify("success");
    }
    emit("closeModal");
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
      <n-form-item label="Фото" path="uploadValue">
        <n-upload>
          <n-button>Загрузить фото</n-button>
        </n-upload>
      </n-form-item>
    </n-form>
    <n-button
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
