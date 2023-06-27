<script setup lang="ts">
import { NSpace, NButton } from "naive-ui";
import { useCreateEntity } from "../composable/useCreateEntity";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { ClassesAttributes, ClassesResponse } from "../types/ClassesTypes";
import MyTextInput from "./MyTextInput.vue";

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

const schema = yup.object({
  name: yup.string().required().min(1),
  description: yup.string().required().min(1),
});
const { useCreate } = useCreateEntity();

const { handleSubmit } = useForm<ClassesAttributes>({
  validationSchema: schema,
});

const handleCreateClass = handleSubmit(async (values: ClassesAttributes) => {
  await useCreate<ClassesResponse, ClassesAttributes>(values, "classes");
  emit("closeModal");
});
</script>

<template>
  <div class="container">
    <n-space vertical>
      <my-text-input name="name" placeholder="Название группы" />
      <my-text-input
        name="description"
        placeholder="Описание группы"
        type="textarea"
      />
      <n-button @click="handleCreateClass">Создать</n-button>
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
