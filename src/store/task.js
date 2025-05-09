import { defineStore } from 'pinia';
import { api } from '@/services/api';

export const useTaskStore = defineStore('task', {
    state: () => ({
        list: [],
        loading: false,
        error: null,
    }),
    actions: {
        async fetchTasks(projectID) {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await api.get(`tasks`, {
                    params: { projectID }
                });
                this.list = data;
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
    }
})