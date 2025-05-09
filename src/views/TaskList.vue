<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      Tareas del Proyecto {{ projectId }}
    </h1>

    <!-- Loader -->
    <div v-if="loading" class="italic">Cargando tareas…</div>

    <!-- Error -->
    <div v-else-if="error" class="text-red-600">
      Error: {{ error.message }}
    </div>

    <!-- Depuración cruda -->
    <pre
      v-if="!loading && !error"
      class="mb-4 bg-gray-100 p-2 overflow-auto"
    >
projectId: {{ projectId }}
tasks raw: {{ tasks }}
    </pre>

    <!-- Renderiza lista -->
    <ul v-if="!loading && !error">
      <li v-for="t in tasks" :key="t.id">
        {{ t.name }} — estado: {{ t.status }} — prioridad: {{ t.priority }}
      </li>
      <li v-if="tasks.length === 0" class="text-gray-500">
        No hay tareas para este proyecto.
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { api } from '@/services/api'

const props = defineProps({
  projectId: { type: String, required: true }
})

const tasks = ref([])
const loading = ref(false)
const error   = ref(null)

async function loadTasks(id) {
  loading.value = true
  error.value   = null
  try {
    // Llamada directa al endpoint, con filtro por projectId
    const { data } = await api.get(`tasks`, {
      params: { projectId: id }
    })
    console.log('Tareas retornadas:', data)
    tasks.value = data
  } catch (err) {
    console.error('Error cargando tasks:', err)
    error.value = err
  } finally {
    loading.value = false
  }
}

onMounted(() => loadTasks(props.projectId))
watch(() => props.projectId, newId => loadTasks(newId))
</script>
