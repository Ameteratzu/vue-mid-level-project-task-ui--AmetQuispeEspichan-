import { defineStore} from 'pinia';
import { api } from '@/services/api';

export const useProjectsStore = defineStore('projects', {
    state: () => ({
        list: [],
        loading: false,
        error: null,
    }),
    actions: {
        async fetchProjects() {
            this.loading = true;
            this.error = null;
            try {
                const {data} = await api.get('/projects');
                this.list = data;
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
    }
})