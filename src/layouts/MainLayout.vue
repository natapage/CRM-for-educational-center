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
import { h, ref, Component, onMounted } from "vue";
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

onMounted(() => {
  const savedActiveKey = localStorage.getItem("activeKey");
  if (savedActiveKey) {
    activeKey.value = savedActiveKey;
  }
});

function updateActiveKey(value: string) {
  activeKey.value = value;
  // Сохранить значение в localStorage при изменении
  localStorage.setItem("activeKey", value);
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
      router.push({ name: "students" });
    },
  },
  {
    label: "Teachers",
    key: "Teachers",
    icon: renderIcon(PersonIcon),
    onClick: () => {
      router.push({ name: "teachers" });
    },
  },
  {
    label: "Classes",
    key: "Classes",
    icon: renderIcon(PeopleOutline),
    onClick: () => {
      router.push({ name: "classes" });
    },
  },
  {
    label: "Lessons",
    key: "Lessons",
    icon: renderIcon(SchoolOutline),
    onClick: () => {
      router.push({ name: "lessons" }); // Перенаправление на главную страницу
    },
  },
  {
    label: "Schedule",
    key: "Schedule",
    icon: renderIcon(BookIcon),
    onClick: () => {
      router.push({ name: "schedule" }); // Перенаправление на главную страницу
    },
  },
  {
    label: "Tasks",
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
      <n-layout-header>Header</n-layout-header>
      <n-layout has-sider position="absolute" style="top: 64px; bottom: 64px">
        <n-layout-sider bordered content-style="padding: 24px;">
          <n-menu
            v-model:value="activeKey"
            mode="vertical"
            :options="menuOptions"
            class="menu"
            @update:value="updateActiveKey"
          />
        </n-layout-sider>
        <n-layout-content
          content-style="padding: 24px;"
          :native-scrollbar="false"
          class="content"
        >
          <slot></slot>
        </n-layout-content>
      </n-layout>
      <n-layout-footer
        bordered
        position="absolute"
        style="height: 64px; padding: 24px"
        >Footer</n-layout-footer
      >
    </n-layout>
  </div>
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
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
}
.content {
  text-align: left;
  overflow-y: auto;
}
</style>
