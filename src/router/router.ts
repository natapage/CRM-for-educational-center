import HomeView from "../views/HomeView.vue";
import ClassesView from "../views/ClassesView.vue";
import LessonsView from "../views/LessonsView.vue";
import ScheduleView from "../views/ScheduleView.vue";
import StudentsView from "../views/StudentsView.vue";
import TasksView from "../views/TasksView.vue";
import TeachersView from "../views/TeachersView.vue";
import StudentProfile from "../components/StudentProfile.vue";

import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/classes",
    component: ClassesView,
  },
  {
    path: "/lessons",
    component: LessonsView,
  },
  {
    path: "/students",
    component: StudentsView,
  },
  {
    path: "/schedule",
    component: ScheduleView,
  },
  {
    path: "/tasks",
    component: TasksView,
  },
  {
    path: "/teachers",
    component: TeachersView,
  },
  {
    path: "/students/:id",
    component: StudentProfile,
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
