<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      Tareas del Proyecto {{ projectId }}
    </h1>

    <Loader v-if="taskStore.loading" />
    <Alert
      v-else-if="taskStore.error"
      :message="taskStore.error.message"
    />
    <pre
      v-if="!taskStore.loading && !taskStore.error"
      class="mb-4 bg-gray-100 p-2 overflow-auto"
    >
projectId: {{ projectId }}
tasks raw: {{ taskStore.list }}
    </pre>
    <Table
      v-if="!taskStore.loading && !taskStore.error"
      :data="taskStore.list"
    />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useTaskStore } from '@/store/task'
import Loader from '@/components/Loader.vue'
import Alert  from '@/components/Alert.vue'
import Table  from '@/components/Table.vue'

const props = defineProps({
  projectId: { type: String, required: true }
})
const taskStore = useTaskStore()

const loadTasks = async () => {
  await taskStore.fetchTasks(props.projectId)
}

onMounted(loadTasks)
watch(() => props.projectId, loadTasks)
</script>
