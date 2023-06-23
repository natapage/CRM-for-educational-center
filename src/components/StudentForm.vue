<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NSpace, NButton, SelectOption, NDatePicker, NSelect } from "naive-ui";
import { createStudent } from "../API/StudentsApi.ts";
import { getClassesWithEntities } from "../API/ClassesApi.ts";
import MyTextInput from "./MyTextInput.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { StudentAttributes } from "../types/StudentsTypes";

const studentBirthDay = ref<number>();
const classOptionsList = ref<SelectOption[]>([]);
const classItem = ref<{ label: string; value: string | number } | null>(null);
const classId = ref<string | number>("");

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

async function getClassesOptions() {
  const response = await getClassesWithEntities();
  classOptionsList.value = response.data.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }));
  console.log(classOptionsList.value);
}

onMounted(() => {
  getClassesOptions();
});

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
  await createStudent(body);
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
  padding: 60px 120px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px; /* Set the maximum width of the container */
  margin: 0 auto; /* Center the container horizontally */
  /* margin-top: 100px; Adjust the top margin as per your preference */
}
</style>
