import { createRouter, createWebHistory } from 'vue-router'
import ProjectList from '@/views/ProjectList.vue'
import TaskList    from '@/views/TaskList.vue'

const routes = [
  { path: '/', redirect: '/projects' },
  { path: '/projects', name: 'projects', component: ProjectList },
  {
    path: '/tasks',
    name: 'tasks',
    component: TaskList,
    props: route => ({ projectId: route.query.project_id })
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
