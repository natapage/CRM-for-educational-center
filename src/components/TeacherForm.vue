<script setup lang="ts">
import { NSpace, NButton, NUpload } from "naive-ui";
import { useCreateEntity } from "../composable/useCreateEntity";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { TeachersAttributes, TeachersResponse } from "../types/TeachersTypes";
import MyTextInput from "./MyTextInput.vue";
import { useNotificationHandler } from "../composable/useNotification";
import { watch } from "vue";

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

const schema = yup.object({
  name: yup.string().required().min(1),
  phone: yup.number().required().min(1),
});
const { error: createError, createItem } = useCreateEntity();
const { notify } = useNotificationHandler();
watch(createError, () => notify("error"));

const { handleSubmit } = useForm<TeachersAttributes>({
  validationSchema: schema,
});

const handleCreateTeacher = handleSubmit(async (values: TeachersAttributes) => {
  await createItem<TeachersResponse, unknown>(values, "teachers");
  if (!createError.value) {
    notify("success");
  }
  emit("closeModal");
});
</script>

<template>
  <div class="container">
    <n-space vertical>
      <my-text-input name="name" placeholder="Имя педагога" />
      <my-text-input name="phone" placeholder="Номер телефона" />
      <n-upload
        action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
        :headers="{
          'naive-info': 'hello!',
        }"
        :data="{
          'naive-data': 'cool! naive!',
        }"
      >
        <n-button>Загрузить фото</n-button>
      </n-upload>
      <n-button @click="handleCreateTeacher">Создать</n-button>
    </n-space>
  </div>
</template>

<style scoped>
.container {
  background-color: #ffffff;
  padding: 60px 120px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px; /* Set the maximum width of the container */
  margin: 0 auto; /* Center the container horizontally */
  /* margin-top: 100px; Adjust the top margin as per your preference */
}
</style>
