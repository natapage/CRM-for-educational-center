<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { watch } from "vue";

import {
  NDatePicker,
  NSelect,
  NForm,
  NFormItem,
  NInput,
  NButton,
  FormInst,
  FormItemRule,
} from "naive-ui";

import { Class } from "../types/ClassesTypes.ts";
import { StudentsResponse } from "../types/StudentsTypes";

import { useCreateEntity } from "../composable/useCreateEntity";
import { useFetch } from "../composable/useFetch";
import { useNotificationHandler } from "../composable/useNotification";

const { error: createError, createItem } = useCreateEntity();
const { data: classes, refetch: refetchClasses } = useFetch<Class[]>("classes");
const { notify } = useNotificationHandler();
const formRef = ref<FormInst | null>(null);

const model = ref({
  studentName: null,
  studentBirthDay: null,
  studentPhone: null,
  description: null,
  studentClass: null,
});

const rules = {
  studentName: {
    required: true,
    trigger: ["blur", "input"],
    message: "Пожалуйста, введите имя ученика",
  },
  studentBirthDay: {
    required: true,
    message: "Пожалуйста, введите дату",
  },
  studentPhone: {
    required: true,
    trigger: ["input"],
    message: "Пожалуйста, введите номер из 11 цифр",
    validator: (rule: FormItemRule, value: string) => {
      console.log(rule);
      return /^(\+)?\d{11}$/.test(value);
    },
  },
  studentClass: {
    required: true,
    message: "Пожалуйста, выберете группу",
  },
};

watch(createError, () => notify("error"));

onMounted(() => refetchClasses());

const emit = defineEmits<{
  (e: "close-modal"): void;
}>();

const classOptionsList = computed(() =>
  classes.value?.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }))
);

function handleCreateStudent(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const body = {
        name: model.value.studentName,
        date: new Date(model.value.studentBirthDay ?? 0),
        phone: model.value.studentPhone,
        description: model.value.description,
        class: {
          connect: [model.value.studentClass],
        },
      };
      // TODO: изменить тип unknown
      await createItem<StudentsResponse, unknown>(body, "students");
      if (!createError.value) {
        notify("success");
      }
      emit("close-modal");
    } else {
      console.log(errors);
      notify("error");
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
      <n-form-item label="ФИО ученика" path="studentName">
        <n-input
          v-model:value="model.studentName"
          placeholder="Введите фамилию, имя и отчество"
        />
      </n-form-item>
      <n-form-item label="Дата рождения" path="studentBirthDay">
        <n-date-picker
          v-model:value="model.studentBirthDay"
          type="date"
          placeholder="Выберете дату"
        />
      </n-form-item>
      <n-form-item label="Номер телефона" path="studentPhone">
        <n-input
          v-model:value="model.studentPhone"
          placeholder="Введите номер"
        />
      </n-form-item>
      <n-form-item label="Особые указания" path="description">
        <n-input
          v-model:value="model.description"
          placeholder="Напишите пару слов о ребенке"
          type="textarea"
          :autosize="{
            minRows: 3,
            maxRows: 5,
          }"
        />
      </n-form-item>
      <n-form-item label="Группа" path="studentClass">
        <n-select
          v-model:value="model.studentClass"
          placeholder="Выберете группу"
          :options="classOptionsList"
          filterable
          tag
        />
      </n-form-item>
    </n-form>
    <n-button
      round
      :disabled="
        model.studentName === null ||
        model.studentBirthDay === null ||
        model.studentClass === null ||
        model.studentPhone === null
      "
      class="add-button"
      @click="handleCreateStudent"
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
