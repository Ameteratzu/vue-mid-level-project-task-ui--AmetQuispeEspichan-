import { defineStore } from 'pinia'
import axios from 'axios'

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
        const response = await axios.get(
          `https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/tasks?projectId=${projectId}`
        )
        this.list = response.data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    }
  }
})
