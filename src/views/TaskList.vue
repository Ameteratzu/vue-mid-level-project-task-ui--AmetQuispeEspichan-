<template>
    <div class="p-6">
        <h1 class="text-2x1 font-bold mb-4">
            Vista de Tareas del proyecto</h1>
        <loader v-if="taskStore.loading" />
        <alert v-else-if="taskStore.error" :message="taskStore.error.message" />
        <table v-else :data="projectStore.list"/>
           
    </div>
</template>


<script setup>
    import { onMounted, watch } from 'vue'
    import { useTaskStore } from '@/store/project'
    import Loader from '@/components/Loader.vue'
    import Alert  from '@/components/Alert.vue'
    import Table  from '@/components/Table.vue'
    
    const taskStore = useTaskStore()

    onMounted(() => {
        projectStore.fetchProjects()
    })
</script>