<template>
  <div class="max-w-3xl mx-auto my-8">
    <router-link to="/projects" class="btn-back">Volver</router-link>

    <h1 class="text-3xl font-bold mb-6 text-center">
      Lista de tareas del proyecto {{ projectId }}
    </h1>

    <div v-if="taskStore.loading" class="italic text-center">Cargando…</div>
    <div v-else-if="taskStore.error" class="text-red-600 text-center mb-4">
      Error: {{ taskStore.error.message }}
    </div>

    <table v-else class="custom-table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Descripción</th>
          <th>Prioridad</th>
          <th>Estado</th>
          <th>Fecha de entrega</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in taskStore.list" :key="t.id">
          <td>{{ t.name }}</td>
          <td>{{ t.description }}</td>
          <td class="capitalize">{{ t.priority }}</td>
          <td class="capitalize">{{ t.status }}</td>
          <td>{{ t.dueDate }}</td>
        </tr>
        <tr v-if="!taskStore.list.length">
          <td colspan="5" class="py-4 text-center text-gray-500">
            No hay tareas para este proyecto.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/store/task'

const route     = useRoute()
const router    = useRouter()
const projectId = route.query.project_id

if (!projectId) router.replace('/projects')

const taskStore = useTaskStore()

onMounted(() => taskStore.fetchTasks(projectId))
watch(
  () => route.query.project_id,
  id => {
    if (id) taskStore.fetchTasks(id)
    else router.replace('/projects')
  }
)
</script>
