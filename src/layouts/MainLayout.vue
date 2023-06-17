<script setup lang="ts">
import {
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutSider,
  NLayoutFooter,
  NIcon,
  NMenu,
} from "naive-ui";
import { h, ref, Ref, Component } from "vue";
import type { MenuOption } from "naive-ui";
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  HomeOutline as HomeIcon,
  ListOutline as ListOutline,
  PeopleOutline as PeopleOutline,
  SchoolOutline as SchoolOutline,
} from "@vicons/ionicons5";
import router from "../router.ts";

const activeKey: Ref<string | null> = ref(null);

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions: MenuOption[] = [
  {
    label: "Home",
    key: "Home",
    icon: renderIcon(HomeIcon),
    onClick: () => {
      router.push("/");
    },
  },
  {
    label: "Students",
    key: "Students",
    icon: renderIcon(PersonIcon),
    onClick: () => {
      router.push("/students"); // Перенаправление на главную страницу
    },
  },
  {
    label: "Teachers",
    key: "Teachers",
    icon: renderIcon(PersonIcon),
    onClick: () => {
      router.push("/teachers"); // Перенаправление на главную страницу
    },
  },
  {
    label: "Classes",
    key: "Classes",
    icon: renderIcon(PeopleOutline),
    onClick: () => {
      router.push("/classes"); // Перенаправление на главную страницу
    },
  },
  {
    label: "Lessons",
    key: "Lessons",
    icon: renderIcon(SchoolOutline),
    onClick: () => {
      router.push("/lessons"); // Перенаправление на главную страницу
    },
  },
  {
    label: "Schedule",
    key: "Schedule",
    icon: renderIcon(BookIcon),
    onClick: () => {
      router.push("/schedule"); // Перенаправление на главную страницу
    },
  },
  {
    label: "Tasks",
    key: "Tasks",
    icon: renderIcon(ListOutline),
    onClick: () => {
      router.push("/tasks"); // Перенаправление на главную страницу
    },
  },
];
</script>
<template>
  <n-layout>
    <n-layout-header>Header</n-layout-header>
    <n-layout has-sider>
      <n-layout-sider content-style="padding: 24px;">
        <n-menu
          v-model:value="activeKey"
          mode="vertical"
          :options="menuOptions"
          class="menu"
        />
      </n-layout-sider>
      <n-layout-content content-style="padding: 24px;">
        <slot></slot>
      </n-layout-content>
    </n-layout>
    <n-layout-footer>Footer</n-layout-footer>
  </n-layout>
</template>

<style scoped>
.n-layout-header {
  background-color: #bfbfbf59;
  padding: 24px;
}

.n-layout-sider {
  background: #ffffff;
}

.n-layout-footer {
  background: #bfbfbf59;
  padding: 24px;
}
</style>
