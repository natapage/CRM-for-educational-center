<script setup lang="ts">
import { h, ref, Ref, Component } from "vue";
import { NIcon, NMenu } from "naive-ui";
import type { MenuOption } from "naive-ui";
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
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
    icon: renderIcon(BookIcon),
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
    icon: renderIcon(BookIcon),
    onClick: () => {
      router.push("/classes"); // Перенаправление на главную страницу
    },
  },
  {
    label: "Lessons",
    key: "Lessons",
    icon: renderIcon(BookIcon),
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
    icon: renderIcon(BookIcon),
    onClick: () => {
      router.push("/tasks"); // Перенаправление на главную страницу
    },
  },
];
</script>

<template>
  <n-menu
    v-model:value="activeKey"
    mode="vertical"
    :options="menuOptions"
    class="menu"
  />
</template>

<style>
.menu {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
}
</style>
