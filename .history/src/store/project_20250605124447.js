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
    },

    async createProject(payload) {
      this.loading = true
      this.error = null
      try {
        await api.post('/projects', payload)
      } catch (err) {
        this.error = err
        throw err // para manejar en el componente si necesitas
      } finally {
        this.loading = false
      }
    },

    async updateProject(id, payload) {
      this.loading = true
      this.error = null
      try {
        await api.put(`/projects/${id}`, payload)
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteProject(id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/projects/${id}`)
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
