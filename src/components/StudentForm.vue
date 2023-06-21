<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  NInput,
  NSpace,
  NButton,
  NDropdown,
  DropdownOption,
  NDatePicker,
  NCard,
} from "naive-ui";
import { Class } from "../types/ClassesTypes.ts";
import { createStudent } from "../API/StudentsApi.ts";
import { getClassesWithEntities } from "../API/ClassesApi.ts";

const studentName = ref<string>("");
const studentBirthDay = ref<number>();
const studentPhone = ref<string>("");
const studentDescription = ref<string>("");
const studentClass = ref<string | number>("");
const classOptionsList = ref<DropdownOption[]>([]);
const classItem = ref<{ label: string; key: number | string } | undefined>();

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

async function getClassesOptions() {
  const response = await getClassesWithEntities();
  classOptionsList.value = response.data.map((item: Class) => ({
    label: item.attributes.name,
    key: item.id,
  }));
  console.log(classOptionsList.value);
}

onMounted(() => {
  getClassesOptions();
});

async function handleCreateStudent() {
  const body = {
    name: studentName.value,
    date: new Date(studentBirthDay.value ?? 0),
    phone: studentPhone.value,
    description: studentDescription.value,
    class: {
      connect: [studentClass.value],
    },
  };
  console.log(body);
  await createStudent(body);
  emit("closeModal");
}

function handleSelect(key: string | number) {
  studentClass.value = key;
  classItem.value = classOptionsList.value.find((item) => item.key === key);
  console.log(classOptionsList.value);
}
</script>

<template>
  <div class="container">
    <n-space vertical>
      <n-input
        v-model:value="studentName"
        size="large"
        type="text"
        placeholder="Имя ученика"
      />
      <n-date-picker
        v-model:value="studentBirthDay"
        type="date"
        placeholder="Дата рождения"
      />

      <n-input
        v-model:value="studentPhone"
        size="large"
        type="text"
        placeholder="Номер телефона"
      />
      <n-input
        v-model:value="studentDescription"
        size="large"
        type="text"
        placeholder="Особые указания"
      />
      <n-dropdown
        placement="bottom-start"
        trigger="click"
        size="medium"
        :options="classOptionsList"
        @select="handleSelect"
      >
        <n-button>Группа</n-button>
      </n-dropdown>
      <n-card size="small"> {{ classItem?.label }} </n-card>
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
