<template>
  <div class="home">
    <div class="banner">
      <h1 class="title">Добро пожаловать в наш учебный центр</h1>
      <p class="description">
        Мы предлагаем широкий спектр образовательных программ и курсов для всех
        возрастов и уровней подготовки.
      </p>
    </div>
    <div class="courses">
      <h2>Популярные курсы</h2>
      <div
        class="course-card"
        v-for="course in popularCourses"
        :key="course.id"
      >
        <h3 class="course-title">{{ course.title }}</h3>
        <p class="course-description">{{ course.description }}</p>
        <n-button @click="enroll(course.id)" type="primary"
          >Записаться</n-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Заглушка для популярных курсов
const popularCourses = ref([
  {
    id: 1,
    title: "Весело учимся",
    description: "Дети изучают письмо, чтение, математику, иностранный язык",
  },
  {
    id: 2,
    title: "Изучаем буквы",
    description: "Дети изучают буквы, учатся читать и составлять предложения ",
  },
  // Добавьте еще курсы...
]);

// Функция для записи на курс (заглушка)
const enroll = (courseId) => {
  alert(`Вы записались на курс с ID ${courseId}`);
};
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.banner {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 36px;
}

.description {
  font-size: 18px;
}

.courses {
  text-align: center;
}

.course-card {
  display: inline-block;
  max-width: 300px;
  padding: 20px;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.course-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
}

.course-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.course-description {
  font-size: 16px;
  margin-bottom: 20px;
}
</style>
