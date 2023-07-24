import HomeView from "../views/HomeView.vue";
import ClassesView from "../views/ClassesView.vue";
import LessonsView from "../views/LessonsView.vue";
import ScheduleView from "../views/ScheduleView.vue";
import StudentsView from "../views/StudentsView.vue";
import TasksView from "../views/TasksView.vue";
import TeachersView from "../views/TeachersView.vue";
import StudentProfile from "../profiles/StudentProfile.vue";
import TeacherProfile from "../profiles/TeacherProfile.vue";
import ClassProfile from "../profiles/ClassProfile.vue";
import TaskProfile from "../profiles/TaskProfile.vue";

import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: HomeView,
    name: "home",
  },
  {
    path: "/classes",
    component: ClassesView,
    name: "classes",
  },
  {
    path: "/classes/:id",
    component: ClassProfile,
    name: "class-profile",
  },
  {
    path: "/schedule",
    component: ScheduleView,
    name: "schedule",
  },
  {
    path: "/lessons",
    component: LessonsView,
    name: "lessons",
  },
  {
    path: "/students",
    component: StudentsView,
    name: "students",
  },
  {
    path: "/students/:id",
    component: StudentProfile,
    name: "student-profile",
  },
  {
    path: "/tasks",
    component: TasksView,
    name: "tasks",
  },
  {
    path: "/tasks/:id",
    component: TaskProfile,
    name: "task-profile",
  },
  {
    path: "/teachers",
    component: TeachersView,
    name: "teachers",
  },
  {
    path: "/teachers/:id",
    component: TeacherProfile,
    name: "teacher-profile",
  },
];
const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
