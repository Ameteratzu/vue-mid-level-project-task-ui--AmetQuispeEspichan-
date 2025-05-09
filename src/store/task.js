import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useTaskStore = defineStore('task', {
  state: () => ({
    list: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchTasks(projectId) {
      this.loading = true
      this.error = null
      try {
        let response
        if (projectId) {
          // Filtro explícito como string en la URL
          response = await api.get(`tasks?projectId=${projectId}`)
        } else {
          // Sin filtro, trae todas
          response = await api.get('tasks')
        }
        console.log('Tareas recibidas (store):', response.data)
        this.list = response.data
      } catch (err) {
        console.error('Error cargando tareas:', err)
        this.error = err
      } finally {
        this.loading = false
      }
    }
  }
})