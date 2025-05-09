/* eslint-disable vue/multi-word-component-names */
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Vista de Proyectos</h1>
    <Loader v-if="projectStore.loading" />
    <Alert v-else-if="projectStore.error" :message="projectStore.error.message" />
    <Table v-else :data="projectStore.list" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProjectStore } from '@/store/project'
import Loader from '@/components/Loader.vue'
import Alert  from '@/components/Alert.vue'
import Table  from '@/components/Table.vue'

const projectStore = useProjectStore()

onMounted(() => {
  projectStore.fetchProjects()
})
</script>
