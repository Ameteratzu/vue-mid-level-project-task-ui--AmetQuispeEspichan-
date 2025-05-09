import { createRouter, createWebHistory } from 'vue-router'
import ProjectList from '@/views/ProjectList.vue'
import TaskList from '@/views/TaskList.vue'

const routes = [
    {   path: '/',  redirect: '/projects'},
    {   path: '/projects', name: '/Projects',component: ProjectList},
    {
        path: '/task',
        name: '/tasks',
        component: TaskList,
        props: (router ) => ({ projectID: router.query.project_id})
    },

]


export default createRouter({
  history: createWebHistory(),
  routes
})