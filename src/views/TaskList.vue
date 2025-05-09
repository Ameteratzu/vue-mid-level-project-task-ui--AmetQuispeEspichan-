<template>
  <div class="max-w-3xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-3xl font-bold mb-6 text-center">
      Tareas del Proyecto {{ projectId }}
    </h1>

    <div v-if="taskStore.loading" class="italic text-center">Cargando…</div>
    <div
      v-else-if="taskStore.error"
      class="text-red-600 text-center mb-4"
    >
      Error: {{ taskStore.error.message }}
    </div>

    <table
      v-else
      class="min-w-full border border-gray-300 divide-y divide-gray-200"
    >
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 border-b">Nombre</th>
          <th class="px-4 py-2 border-b">Estado</th>
          <th class="px-4 py-2 border-b">Prioridad</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="t in taskStore.list"
          :key="t.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2">{{ t.name }}</td>
          <td class="px-4 py-2 capitalize">{{ t.status }}</td>
          <td class="px-4 py-2 capitalize">{{ t.priority }}</td>
        </tr>
        <tr v-if="taskStore.list.length === 0">
          <td colspan="3" class="px-4 py-4 text-center text-gray-500">
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
