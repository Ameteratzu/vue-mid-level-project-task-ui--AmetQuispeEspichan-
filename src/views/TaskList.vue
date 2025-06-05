<template>
  <div class="container-tasks">
    <router-link to="/projects" class="btn-back">
      <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Volver
    </router-link>

    <h1 class="main-title">
      Lista de tareas del proyecto <span class="text-blue-700">#{{ projectId }}</span>
    </h1>

    <div v-if="taskStore.loading" class="state-text">Cargando…</div>
    <div v-else-if="taskStore.error" class="state-text error">
      Error: {{ taskStore.error.message }}
    </div>

    <div v-else>
      <div class="table-responsive">
        <table class="main-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Fecha de entrega</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in taskStore.list" :key="t.id" class="row-hover">
              <td>{{ t.name }}</td>
              <td>{{ t.description }}</td>
              <td>
                <span :class="['badge', badgePriority(t.priority)]">{{ capitalize(t.priority) }}</span>
              </td>
              <td>
                <span :class="['badge', badgeStatus(t.status)]">{{ capitalize(t.status) }}</span>
              </td>
              <td>
                <span class="date-cell">
                  <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="4" stroke-width="2"/>
                    <path d="M16 2v4M8 2v4M3 10h18" stroke-width="2"/>
                  </svg>
                  {{ formatDate(t.dueDate) }}
                </span>
              </td>
            </tr>
            <tr v-if="!taskStore.list.length">
              <td colspan="5" class="state-text">No hay tareas para este proyecto.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/store/task'

const route     = useRoute()
const router    = useRouter()
const projectId = route.query.project_id

if (!projectId) router.replace('/projects')

const taskStore = useTaskStore()

onMounted(() => taskStore.fetchTasks(projectId))
watch(
  () => route.query.project_id,
  id => {
    if (id) taskStore.fetchTasks(id)
    else router.replace('/projects')
  }
)

// Helpers
const capitalize = (txt) => txt ? txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase() : ''
const badgePriority = (prio) => {
  if (!prio) return ''
  if (prio.toLowerCase() === 'alta' || prio.toLowerCase() === 'high') return 'badge-priority-high'
  if (prio.toLowerCase() === 'media' || prio.toLowerCase() === 'medium') return 'badge-priority-medium'
  if (prio.toLowerCase() === 'baja' || prio.toLowerCase() === 'low') return 'badge-priority-low'
  return ''
}
const badgeStatus = (stat) => {
  if (!stat) return ''
  if (stat.toLowerCase() === 'completada' || stat.toLowerCase() === 'completed') return 'badge-status-completed'
  if (stat.toLowerCase() === 'pendiente' || stat.toLowerCase() === 'pending') return 'badge-status-pending'
  if (stat.toLowerCase() === 'en progreso' || stat.toLowerCase() === 'in progress') return 'badge-status-inprogress'
  return 'badge-status-other'
}
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: '2-digit' })
}
</script>

<style scoped>
.container-tasks {
  background: #f8fafc;
  padding: 36px 16px 30px 16px;
  border-radius: 22px;
  box-shadow: 0 3px 32px #00000015;
  max-width: 880px;
  margin: 38px auto 0 auto;
}
.main-title {
  text-align: center;
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 28px;
  color: #2d3846;
  letter-spacing: 0.01em;
}
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f0f3fa;
  color: #2b74c6;
  border-radius: 9px;
  font-weight: 600;
  font-size: 1rem;
  padding: 8px 16px;
  text-decoration: none;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px #2b74c612;
  transition: background 0.15s, color 0.15s;
}
.btn-back:hover {
  background: #e2edfa;
  color: #165ab6;
}
.icon {
  width: 19px;
  height: 19px;
  stroke-width: 1.6;
}
.table-responsive {
  overflow-x: auto;
  border-radius: 14px;
  background: white;
}
.main-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 10px;
}
.main-table thead tr {
  background: #14a7ea;
}
.main-table th, .main-table td {
  padding: 13px 14px;
  text-align: center;
  font-size: 1rem;
  color: #2d3846;
}
.main-table th {
  color: #fff;
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: .02em;
}
.main-table tbody tr:nth-child(odd) {
  background: #f3f8fc;
}
.main-table tbody tr:nth-child(even) {
  background: #e8f2fc;
}
.row-hover:hover {
  background: #d4eafd !important;
  transition: background .18s;
}
.badge {
  display: inline-block;
  min-width: 74px;
  border-radius: 13px;
  font-size: .98rem;
  font-weight: 600;
  padding: 5px 13px;
  letter-spacing: 0.01em;
}
.badge-priority-high {
  background: #ffebeb;
  color: #e63b3b;
  border: 1px solid #ffc6c6;
}
.badge-priority-medium {
  background: #fff7e4;
  color: #e59c1a;
  border: 1px solid #ffe7b3;
}
.badge-priority-low {
  background: #ebf7e9;
  color: #29a153;
  border: 1px solid #b2edc7;
}
.badge-status-completed {
  background: #e8faea;
  color: #18b044;
  border: 1px solid #95ebb5;
}
.badge-status-pending {
  background: #fff7e4;
  color: #c08617;
  border: 1px solid #ffe7b3;
}
.badge-status-inprogress {
  background: #e8f3fe;
  color: #1c6fe8;
  border: 1px solid #b1d4fa;
}
.badge-status-other {
  background: #efefef;
  color: #757c8a;
  border: 1px solid #dadada;
}
.date-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  font-family: inherit;
  color: #357ad1;
  font-weight: 600;
}
.state-text {
  text-align: center;
  color: #9199ac;
  margin: 34px 0 10px 0;
  font-size: 1.13rem;
}
.state-text.error {
  color: #e00d3d;
}
@media (max-width: 700px) {
  .container-tasks {
    padding: 9px 1px;
    border-radius: 10px;
  }
  .main-table th, .main-table td {
    padding: 7px 6px;
    font-size: 0.97rem;
  }
  .main-title {
    font-size: 1.15rem;
    margin-bottom: 13px;
  }
}
</style>
