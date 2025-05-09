<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <nav class="p-4 bg-white dark:bg-gray-900 shadow mb-6">
      <router-link
        to="/projects"
        class="mr-4 hover:underline"
        active-class="font-bold"
      >Proyectos</router-link>
      <router-link
        :to="{ path: '/tasks', query: { project_id: 1 } }"
        class="hover:underline"
        active-class="font-bold"
      >Tareas</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
