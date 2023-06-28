<script setup lang="ts">
import { ref, computed } from "vue";
import { NSpace, NButton, NDatePicker, NSelect } from "naive-ui";
import MyTextInput from "./MyTextInput.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useCreateEntity } from "../composable/useCreateEntity";
import { useFetchPage } from "../composable/useFetchPage";
import { Class } from "../types/ClassesTypes.ts";
import { StudentsResponse, StudentAttributes } from "../types/StudentsTypes";
import { useNotificationHandler } from "../composable/useNotification";
import { watch } from "vue";

const studentBirthDay = ref<number>();
const classItem = ref<{ label: string; value: string | number } | null>(null);
const classId = ref<string | number>("");
const { error: createError, createItem } = useCreateEntity();

const { entities: classes } = useFetchPage<Class>("classes");
const { notify } = useNotificationHandler();
watch(createError, () => notify("error"));

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

const schema = yup.object({
  name: yup.string().required().min(1),
  phone: yup.number().required().min(1),
  description: yup.string().min(1),
});

const { handleSubmit } = useForm<StudentAttributes>({
  validationSchema: schema,
});

const classOptionsList = computed(() =>
  classes.value.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }))
);

const handleCreateStudent = handleSubmit(async (values: StudentAttributes) => {
  const id = classId.value;
  classItem.value =
    classOptionsList.value.find((item) => item.value === id) ?? null;

  const body = {
    name: values.name,
    date: new Date(studentBirthDay.value ?? 0),
    phone: values.phone,
    description: values.description,
    class: {
      connect: [classItem.value?.value],
    },
  };
  // TODO: изменить тип unknown
  await createItem<StudentsResponse, unknown>(body, "students");
  if (!createError) {
    notify("success");
  }
  emit("closeModal");
});
</script>

<template>
  <div class="container">
    <n-space vertical>
      <my-text-input name="name" placeholder="Имя ученика" />
      <n-date-picker
        format="dd.MM.yyyy"
        required="true"
        v-model:value="studentBirthDay"
        type="date"
        placeholder="Дата рождения"
      />
      <my-text-input name="phone" placeholder="Номер телефона" />
      <my-text-input
        name="description"
        placeholder="Особые указания"
        type="text"
      />
      <n-select
        v-model:value="classId"
        :options="classOptionsList"
        placeholder="Выберите группу"
      />
      <n-button @click="handleCreateStudent" type="primary">Создать</n-button>
    </n-space>
  </div>
</template>

<style scoped>
.container {
  background-color: #ffffff;
  width: 400px;
  padding: 60px 120px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px; /* Set the maximum width of the container */
  margin: 0 auto; /* Center the container horizontally */
  /* margin-top: 100px; Adjust the top margin as per your preference */
}
</style>
