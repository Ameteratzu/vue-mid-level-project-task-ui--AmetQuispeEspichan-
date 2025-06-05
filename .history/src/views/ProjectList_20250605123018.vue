<template>
  <div class="max-w-4xl mx-auto my-10 px-4 py-6 bg-white shadow-xl rounded-2xl border border-gray-200">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">Vista de Proyectos</h1>
    <div class="mb-6 flex flex-col sm:flex-row gap-2 items-center justify-between">
      <input
        v-model="search"
        placeholder="Buscar proyecto..."
        class="border px-3 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-64"
      />
      <button
        class="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        @click="refreshProjects"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.418 2A7.967 7.967 0 0012 4a7.967 7.967 0 00-7.418 5M4 4l5 5m6 6v5h-.582m-6.418-2A7.967 7.967 0 0012 20a7.967 7.967 0 007.418-5M20 20l-5-5" /></svg>
        Refrescar
      </button>
    </div>

    <div v-if="projectStore.loading" class="italic text-center animate-pulse py-12">Cargando…</div>
    <div v-else-if="projectStore.error" class="text-red-600 text-center mb-4 py-8">
      Error: {{ projectStore.error.message }}
    </div>

    <div v-else>
      <div class="overflow-x-auto rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-blue-500 text-white">
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in filteredProjects"
              :key="p.id"
              class="hover:bg-blue-50 transition"
            >
              <td class="px-6 py-4 font-medium text-gray-900">{{ p.name }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-xs',
                    p.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-600'
                  ]"
                >
                  <svg
                    v-if="p.status === 'active'"
                    class="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <circle cx="10" cy="10" r="8" />
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
                    <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
                    <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span>
                    {{ p.status === 'active' ? 'Activo' : 'Inactivo' }}
                  </span>
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <router-link
                  :to="{ path: '/tasks', query: { project_id: p.id } }"
                  class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg shadow hover:bg-blue-700 transition font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z"/>
                  </svg>
                  Ver tareas
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredProjects.length === 0" class="text-center py-10 text-gray-400">
          No se encontraron proyectos.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/store/project'

const projectStore = useProjectStore()
const search = ref('')

onMounted(() => projectStore.fetchProjects())
const refreshProjects = () => projectStore.fetchProjects()

const filteredProjects = computed(() => {
  return projectStore.list.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>
