<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NInput, NSpace, NButton, NDropdown, DropdownOption } from "naive-ui";
import { Class } from "../types/ClassesTypes.ts";
import { createStudent } from "../API/StudentsApi.ts";
import { getClassesWithEntities } from "../API/ClassesApi";

const studentName = ref<string>("");
const studentBirthDay = ref<string>("");
const studentPhone = ref<number>(0);
const studentDescription = ref<string>("");
const studentClass = ref<string | number>("");
const classOptions = ref<DropdownOption[]>([]);

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

async function getClassesOptions() {
  const response = await getClassesWithEntities();
  classOptions.value = response.data.map((item: Class) => ({
    label: item.attributes.name,
  }));
}

onMounted(() => {
  getClassesOptions();
});

async function handleCreateStudent() {
  const body = {
    name: studentName.value,
    date: studentBirthDay.value,
    phone: studentPhone.value,
    description: studentDescription.value,
    class: {
      data: {
        attributes: {
          name: studentClass.value,
        },
      },
    },
  };
  await createStudent(body);
  emit("closeModal");
}

function handleSelect(key: string | number) {
  studentClass.value = String(key);
}
</script>

<template>
  <div class="container">
    <n-space vertical>
      <n-input
        v-model="studentName"
        size="large"
        type="text"
        placeholder="Имя ученика"
      />
      <n-input
        v-model="studentBirthDay"
        size="large"
        type="textarea"
        placeholder="Дата рождения"
      />
      <n-input
        v-model="studentPhone"
        size="large"
        type="text"
        placeholder="Номер телефона"
      />
      <n-input
        v-model="studentDescription"
        size="large"
        type="text"
        placeholder="Особые указания"
      />
      <n-dropdown
        placement="bottom-start"
        trigger="click"
        size="medium"
        :options="classOptions"
        @select="handleSelect"
      >
        <n-button>Группа</n-button>
      </n-dropdown>
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
