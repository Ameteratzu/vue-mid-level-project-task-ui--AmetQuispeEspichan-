<template>
  <div class="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-3xl font-bold mb-6 text-center">Vista de Proyectos</h1>

    <div v-if="projectStore.loading" class="italic text-center">Cargando…</div>
    <div
      v-else-if="projectStore.error"
      class="text-red-600 text-center mb-4"
    >
      Error: {{ projectStore.error.message }}
    </div>

    <table v-else class="custom-table">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 border-b">Nombre</th>
          <th class="px-4 py-2 border-b">Estado</th>
          <th class="px-4 py-2 border-b">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="p in projectStore.list"
          :key="p.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2">{{ p.name }}</td>
          <td class="px-4 py-2 capitalize">{{ p.status }}</td>
          <td class="px-4 py-2 text-center">
            <router-link
              :to="{ path: '/tasks', query: { project_id: p.id } }"
              class="text-blue-600 hover:underline"
            >
              Ver tareas
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProjectStore } from '@/store/project'

const projectStore = useProjectStore()
onMounted(() => projectStore.fetchProjects())
</script>
