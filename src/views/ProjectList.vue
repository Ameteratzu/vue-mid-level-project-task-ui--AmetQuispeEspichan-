<template>
    <div class="p-6">
        <h1 class="text-2x1 font-bold mb-4">Vista de Proyectos</h1>
        <loader v-if="projectStore.loading" />
        <alert v-else-if="projectStore.error" :message="projectStore.error.message" />
        <table v-else :data="projectStore.list" />
    </div>
</template>



<script setup>
import { onMounted } from 'vue'
import { useProjectStore } from '@/store/project'

const projectStore = useProjectStore()

onMounted(( )=> {
    projectStore.fetchProjects();
})
</script>