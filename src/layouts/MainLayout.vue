<script setup lang="ts">
import { h, ref, Component, onMounted } from "vue";
import {
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutSider,
  NLayoutFooter,
  NIcon,
  NMenu,
  NAvatar,
  NSpace,
} from "naive-ui";
import type { MenuOption } from "naive-ui";
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  HomeOutline as HomeIcon,
  ListOutline as ListOutline,
  PeopleOutline as PeopleOutline,
  SchoolOutline as SchoolOutline,
} from "@vicons/ionicons5";
import router from "../router/router.ts";

const activeKey = ref<string | null>(null);

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const url: string =
  `${import.meta.env.VITE_API_BASE_URL}` +
  "/uploads/thumbnail_277_2779206_view_ads_in_education_learning_classified_category_dr_apj_abdul_kalam_technical_843eb398ef.png";
onMounted(() => {
  const savedActiveKey = localStorage.getItem("activeKey");
  if (savedActiveKey) {
    activeKey.value = savedActiveKey;
  }
});

function updateActiveKey(value: string) {
  activeKey.value = value;
  localStorage.setItem("activeKey", value);
}

const menuOptions: MenuOption[] = [
  {
    label: "Учебный центр",
    key: "Home",
    icon: renderIcon(HomeIcon),
    onClick: () => {
      router.push("/");
    },
  },
  {
    label: "Ученики",
    key: "Students",
    icon: renderIcon(PersonIcon),
    onClick: () => {
      router.push({ name: "students" });
    },
  },
  {
    label: "Учителя",
    key: "Teachers",
    icon: renderIcon(PersonIcon),
    onClick: () => {
      router.push({ name: "teachers" });
    },
  },
  {
    label: "Группы",
    key: "Classes",
    icon: renderIcon(PeopleOutline),
    onClick: () => {
      router.push({ name: "classes" });
    },
  },
  {
    label: "Предметы",
    key: "Lessons",
    icon: renderIcon(SchoolOutline),
    onClick: () => {
      router.push({ name: "lessons" }); // Перенаправление на главную страницу
    },
  },
  {
    label: "Расписание",
    key: "Schedule",
    icon: renderIcon(BookIcon),
    onClick: () => {
      router.push({ name: "schedule" }); // Перенаправление на главную страницу
    },
  },
  {
    label: "Задачи для учителей",
    key: "Tasks",
    icon: renderIcon(ListOutline),
    onClick: () => {
      router.push({ name: "tasks" }); // Перенаправление на главную страницу
    },
  },
];
</script>
<template>
  <div class="container">
    <n-layout>
      <n-layout-header>
        <n-space horizontal align="center">
          <n-avatar round size="large" :src="url"></n-avatar>
          <h1 style="padding: 0; margin: 0">Dana Tulga</h1>
        </n-space>
      </n-layout-header>
      <n-layout has-sider position="absolute" style="top: 64px; bottom: 64px">
        <n-layout-sider
          :native-scrollbar="false"
          bordered
          content-style="padding: 24px;"
        >
          <n-menu
            v-model:value="activeKey"
            mode="vertical"
            :options="menuOptions"
            class="menu"
            @update:value="updateActiveKey"
          />
        </n-layout-sider>
        <n-layout-content content-style="padding: 24px;">
          <slot></slot>
        </n-layout-content>
      </n-layout>
      <n-layout-footer
        bordered
        position="absolute"
        style="height: 64px; padding: 24px"
        ><a href="https://github.com/natapage/CRM-for-educational-center">
          GitHub</a
        ></n-layout-footer
      >
    </n-layout>
  </div>
</template>

<style scoped>
.n-layout-header {
  background-color: #bfbfbf59;
  padding: 12px 24px;
}

.n-layout-sider {
  background: #ffffff;
}

.n-layout-footer {
  background: #bfbfbf59;
  padding: 24px;
}
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
}
</style>
