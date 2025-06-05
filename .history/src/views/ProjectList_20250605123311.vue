<template>
  <div class="container-table">
    <h1 class="main-title">Vista de Proyectos</h1>
    <div class="tools-bar">
      <input
        v-model="search"
        placeholder="Buscar proyecto…"
        class="search-input"
      />
      <button class="refresh-btn" @click="refreshProjects" title="Refrescar">
        <svg class="icon" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4 4v5h.582m15.418 2A7.967 7.967 0 0012 4a7.967 7.967 0 00-7.418 5M4 4l5 5m6 6v5h-.582m-6.418-2A7.967 7.967 0 0012 20a7.967 7.967 0 007.418-5M20 20l-5-5"/></svg>
        Refrescar
      </button>
    </div>
    <div v-if="projectStore.loading" class="state-text">Cargando…</div>
    <div v-else-if="projectStore.error" class="state-text error">
      Error: {{ projectStore.error.message }}
    </div>
    <div v-else>
      <div class="table-responsive">
        <table class="main-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in filteredProjects"
              :key="p.id"
              class="row-hover"
            >
              <td>{{ p.name }}</td>
              <td>
                <span
                  :class="[
                    'badge',
                    p.status === 'active' ? 'badge-active' : 'badge-inactive'
                  ]"
                >
                  <svg v-if="p.status === 'active'" class="badge-icon" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8"/></svg>
                  <svg v-else class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/></svg>
                  {{ p.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <router-link
                  :to="{ path: '/tasks', query: { project_id: p.id } }"
                  class="task-btn"
                >
                  <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-width="2" d="M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z"/>
                  </svg>
                  Ver tareas
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredProjects.length === 0" class="state-text">No se encontraron proyectos.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/store/project'

const projectStore = useProjectStore()
const search = ref('')

onMounted(() => projectStore.fetchProjects())
const refreshProjects = () => projectStore.fetchProjects()

const filteredProjects = computed(() => {
  return projectStore.list.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<style scoped>
.container-table {
  background: #f8fafc;
  padding: 40px 20px;
  border-radius: 24px;
  box-shadow: 0 3px 32px #00000015;
  max-width: 900px;
  margin: 40px auto;
}
.main-title {
  text-align: center;
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 32px;
  color: #2d3846;
}
.tools-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 12px;
}
.search-input {
  padding: 8px 14px;
  border-radius: 9px;
  border: 1px solid #c2c7d0;
  width: 220px;
  font-size: 1rem;
  outline: none;
  transition: border .2s;
}
.search-input:focus {
  border-color: #2292fa;
}
.refresh-btn {
  background: #e6f0fa;
  color: #1968a9;
  border: none;
  padding: 7px 18px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: background .18s;
}
.refresh-btn:hover {
  background: #bee3fd;
}
.icon {
  width: 20px;
  height: 20px;
}
.state-text {
  text-align: center;
  color: #9199ac;
  margin: 30px 0 10px 0;
  font-size: 1.13rem;
}
.state-text.error {
  color: #e00d3d;
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
}
.main-table thead tr {
  background: #14a7ea;
}
.main-table th, .main-table td {
  padding: 14px 18px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #283044;
}
.main-table th {
  color: #fff;
  font-size: 1.05rem;
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
  transition: background .2s;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 13px;
  font-size: 0.96rem;
  border-radius: 14px;
  font-weight: 600;
}
.badge-active {
  background: #d5f6e3;
  color: #179949;
}
.badge-inactive {
  background: #f2f2f2;
  color: #979da6;
}
.badge-icon {
  width: 15px;
  height: 15px;
}
.task-btn {
  background: #1780fa;
  color: #fff;
  padding: 7px 19px 7px 12px;
  border-radius: 9px;
  font-weight: 600;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 4px #2292fa15;
  transition: background .15s, transform .13s;
  text-decoration: none;
}
.task-btn:hover {
  background: #1467b7;
  color: #fff;
  transform: translateY(-2px) scale(1.03);
}
@media (max-width: 720px) {
  .container-table {
    padding: 10px 2px;
    border-radius: 10px;
  }
  .main-table th, .main-table td {
    padding: 9px 7px;
    font-size: 0.98rem;
  }
  .main-title {
    font-size: 1.3rem;
    margin-bottom: 22px;
  }
  .search-input {
    width: 130px;
    font-size: 0.9rem;
  }
}
</style>
