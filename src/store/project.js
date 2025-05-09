import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useProjectStore = defineStore('project', {
  state: () => ({
    list: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchProjects() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/projects')
        this.list = data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    }
  }
})
