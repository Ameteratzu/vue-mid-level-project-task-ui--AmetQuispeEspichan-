<template>
  <div class="max-w-4xl mx-auto my-8 p-4 sm:p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">Vista de Proyectos</h1>
      <div class="flex gap-2 items-center">
        <input
          v-model="search"
          placeholder="Buscar proyecto..."
          class="border px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          class="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
          @click="refreshProjects"
          title="Refrescar"
        >
          <span class="icon-[mdi--refresh]"></span> <!-- Si usas un set de iconos -->
          🔄
        </button>
        <button
          class="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
          @click="newProject"
        >
          + Nuevo
        </button>
      </div>
    </div>

    <div v-if="projectStore.loading" class="italic text-center animate-pulse">Cargando…</div>
    <div v-else-if="projectStore.error" class="text-red-600 text-center mb-4">
      Error: {{ projectStore.error.message }}
    </div>

    <div v-else>
      <table class="custom-table w-full text-base">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-3 py-2 text-left cursor-pointer" @click="sortBy('name')">
              Nombre
              <span v-if="sort.key === 'name'">
                {{ sort.asc ? '⬆️' : '⬇️' }}
              </span>
            </th>
            <th class="px-3 py-2 text-left cursor-pointer" @click="sortBy('status')">
              Estado
              <span v-if="sort.key === 'status'">
                {{ sort.asc ? '⬆️' : '⬇️' }}
              </span>
            </th>
            <th class="px-3 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in filteredProjects"
            :key="p.id"
            class="hover:bg-blue-50 transition"
          >
            <td class="px-3 py-2 font-medium">{{ p.name }}</td>
            <td class="px-3 py-2">
              <span
                :class="badgeClass(p.status)"
                class="inline-block rounded-full px-3 py-1 text-xs font-semibold"
              >
                <span v-if="p.status === 'activo'">🟢</span>
                <span v-else-if="p.status === 'pausado'">🟡</span>
                <span v-else>🔴</span>
                {{ p.status }}
              </span>
            </td>
            <td class="px-3 py-2 flex gap-2 justify-center">
              <router-link
                :to="{ path: '/tasks', query: { project_id: p.id } }"
                class="text-blue-600 hover:underline"
                title="Ver tareas"
              >👁️</router-link>
              <button class="text-green-600 hover:underline" @click="editProject(p)" title="Editar">✏️</button>
              <button class="text-red-600 hover:underline" @click="removeProject(p)" title="Eliminar">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredProjects.length === 0" class="text-center py-10 text-gray-500">
        No se encontraron proyectos.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/store/project'

const projectStore = useProjectStore()
const search = ref('')
const sort = ref({ key: 'name', asc: true })

onMounted(() => projectStore.fetchProjects())

const refreshProjects = () => projectStore.fetchProjects()
const newProject = () => alert('Función para crear nuevo proyecto (implementa modal/formulario)')
const editProject = (p) => alert('Editar proyecto: ' + p.name)
const removeProject = (p) => {
  if (confirm(`¿Seguro que deseas eliminar el proyecto "${p.name}"?`)) {
    // Implementa lógica real aquí
    alert('Proyecto eliminado (implementa función real)')
  }
}

const filteredProjects = computed(() => {
  let arr = projectStore.list.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
  arr = [...arr].sort((a, b) => {
    if (sort.value.key === 'name') {
      return sort.value.asc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    }
    if (sort.value.key === 'status') {
      return sort.value.asc
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status)
    }
    return 0
  })
  return arr
})

const sortBy = (key) => {
  if (sort.value.key === key) {
    sort.value.asc = !sort.value.asc
  } else {
    sort.value.key = key
    sort.value.asc = true
  }
}

// Utilidad para colorear badges
const badgeClass = (status) => {
  if (status === 'activo') return 'bg-green-100 text-green-700'
  if (status === 'pausado') return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}
</script>

<style scoped>
/* Responsive tabla (scroll horizontal en móviles) */
.custom-table {
  min-width: 400px;
  border-collapse: collapse;
  width: 100%;
}
@media (max-width: 600px) {
  .custom-table {
    display: block;
    overflow-x: auto;
    width: 100%;
  }
}
</style>
