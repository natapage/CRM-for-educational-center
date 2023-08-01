<script setup lang="ts">
import { NGrid, NGridItem, NSelect } from "naive-ui";
import { ref, computed, onMounted, watch } from "vue";
import { Class } from "../types/ClassesTypes";
import { Lesson } from "../types/LessonsTypes";
import { Slot, SlotsResponse } from "../types/SlotsTypes";
import { useFetch } from "../composable/useFetch";
import { useCreateEntity } from "../composable/useCreateEntity";
import { useEditEntityById } from "../composable/useEditEntityById";
import { useNotificationHandler } from "../composable/useNotification";
import { daysOfWeek, lessonsOrder } from "../constants/constants.ts";

onMounted(async () => {
  await Promise.all([refetchClasses(), refetchSlots(), refetchLessons()]);
});

const selectedClass = ref<number>();
const selectedLesson = ref<number | null>();
const selectedSlot = ref<Slot>();
const selectedDay = ref<string>("");
const selectedOrder = ref<string>("");
const isSelectShow = ref<boolean>(false);

const { notify } = useNotificationHandler();

const {
  data: classes,
  // error: fetchClassesError,
  // showSpinner,
  refetch: refetchClasses,
} = useFetch<Class[]>("classes");

const {
  data: lessons,
  // error: fetchClassesError,
  // showSpinner,
  refetch: refetchLessons,
} = useFetch<Lesson[]>("lessons");

const {
  data: slots,
  // error: fetchError,
  // showSpinner,
  refetch: refetchSlots,
} = useFetch<Slot[]>("slots");

const { error: editSlotError, editItemById: editSlot } = useEditEntityById<
  SlotsResponse,
  Slot
>(`slots`);

const { error: createError, createItem: createSlot } = useCreateEntity();

const filteredSlots = computed(() => {
  isSelectShow.value = false;
  if (selectedClass.value) {
    return slots.value?.filter(
      (slot) => slot.attributes?.class?.data.id === selectedClass.value
    );
  }
  return slots.value;
});

const classesOptionsList = computed(() =>
  classes.value?.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }))
);

const lessonsOptionsList = computed(() =>
  lessons.value?.map((item) => ({
    label: item.attributes.name,
    value: item.id,
  }))
);

function getSlot(dayOfWeek: string, lessonOrder: string) {
  return filteredSlots.value?.find(
    (slot) =>
      slot.attributes.dayofweek === dayOfWeek &&
      slot.attributes.order === lessonOrder
  );
}

function handleClick(day: string, order: string) {
  selectedLesson.value = null;
  selectedDay.value = day;
  selectedOrder.value = order;
  selectedSlot.value = getSlot(day, order);
  isSelectShow.value = true;
}

async function handleEditLesson(day: string, order: string) {
  const body: any = {
    order: order,
    dayofweek: day,
  };
  if (selectedLesson.value) {
    body.lesson = {
      connect: [selectedLesson.value],
    };
  }
  if (selectedClass.value) {
    body.class = {
      connect: [selectedClass.value],
    };
  }
  if (!selectedSlot.value) {
    await createSlot(body, "slots");
  }

  if (selectedSlot.value) {
    await editSlot(selectedSlot.value.id, body);

    if (!editSlotError.value) {
      notify("success", "Урок успешно отредактирован");
    }
    if (editSlotError.value) {
      notify("error", "Невозможно отредактировать урок");
    }
  }
  isSelectShow.value = false;
  refetchSlots();
  refetchLessons();
}

watch(createError, () => notify("error", "Ошибка загрузки странички"));
</script>
<template>
  <div>
    <h2>Расписание занятий</h2>
    <h3>Выберите, пожалуйста, группу</h3>

    <div class="select-container">
      <n-select
        v-model:value="selectedClass"
        clearable
        filterable
        tag
        :options="classesOptionsList"
        placeholder="Выберите группу"
      >
      </n-select>
    </div>
    <n-grid :x-gap="8" :cols="6" v-if="selectedClass">
      <n-grid-item>
        <div class="lesson"></div>
        <n-grid :y-gap="8" :rows="3" :cols="1">
          <n-grid-item v-for="order in lessonsOrder" :key="order">
            <div class="lesson bold-text">
              {{ order }}
            </div>
          </n-grid-item>
        </n-grid>
      </n-grid-item>
      <n-grid-item v-for="day in daysOfWeek">
        <div>
          <div class="lesson bold-text">{{ day }}</div>
          <n-grid :y-gap="8" :rows="3" :cols="1">
            <n-grid-item
              v-for="(order, orderIndex) in lessonsOrder"
              :key="orderIndex"
            >
              <div @click="handleClick(day, order)" class="lesson colored">
                <div
                  v-if="
                    getSlot(day, order)?.attributes.lesson?.data.attributes.name
                  "
                >
                  {{
                    getSlot(day, order)?.attributes.lesson?.data.attributes.name
                  }}
                </div>
                <div v-else>нет урока</div>
                <n-select
                  v-if="
                    isSelectShow &&
                    selectedDay === day &&
                    selectedOrder === order
                  "
                  v-model:value="selectedLesson"
                  tag
                  :options="lessonsOptionsList"
                  placeholder="Выберите урок"
                  @update:value="handleEditLesson(day, order)"
                  @blur="isSelectShow = false"
                >
                </n-select>
              </div>
            </n-grid-item>
          </n-grid>
        </div>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
.lesson {
  height: 50px;
  padding: 15px;
  text-align: center;
  border-radius: 4px;
}
.colored {
  background-color: rgba(0, 128, 0, 0.12);
  cursor: pointer;
}
.bold-text {
  font-weight: bold;
}
.select-container {
  width: 400px; /* Задайте желаемую ширину для контейнера выпадающего списка */
  margin-bottom: 10px; /* Опционально: задайте отступ снизу, если требуется */
}
</style>
../constants/constants.ts
