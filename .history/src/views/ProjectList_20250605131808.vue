<template>
  <div class="container-table">
    <h1 class="main-title">Lista de Proyectos</h1>
    <div class="tools-bar">
      <input
        v-model="search"
        placeholder="Buscar por nombre..."
        class="search-input"
      />
      <select v-model="filtroEstado" class="filter-select">
        <option value="">Todos</option>
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
      </select>
      <button class="add-btn" @click="openCreateModal">
        + Nuevo Proyecto
      </button>
    </div>

    <Loader v-if="projectStore.loading" />

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
            <tr v-for="p in proyectosFiltrados" :key="p.id" class="row-hover">
              <td>{{ p.name }}</td>
              <td>
                <span :class="['badge', p.status === 'active' ? 'badge-active' : 'badge-inactive']">
                  {{ p.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <button class="edit-btn" @click="openEditModal(p)">Editar</button>
                <button class="delete-btn" @click="confirmDelete(p)">Eliminar</button>
              </td>
            </tr>
            <tr v-if="!proyectosFiltrados.length">
              <td colspan="3" class="state-text">No hay proyectos.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL para crear/editar -->
    <transition name="fade">
      <div v-if="modal.open" class="modal-bg">
        <div class="modal-content">
          <h2 class="modal-title">{{ modal.editing ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</h2>
          <ProjectForm
            :project="modal.editing ? modal.data : null"
            @submit="onSubmit"
            @cancel="closeModal"
          />
        </div>
      </div>
    </transition>

    <!-- Confirmación de borrado -->
    <transition name="fade">
      <div v-if="confirmDeleteProject" class="modal-bg">
        <div class="modal-content">
          <h3>¿Eliminar el proyecto "{{ confirmDeleteProject.name }}"?</h3>
          <div class="flex gap-4 mt-4 justify-end">
            <button @click="deleteProject" class="delete-btn">Eliminar</button>
            <button @click="confirmDeleteProject = null" class="edit-btn">Cancelar</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProjectStore } from '@/store/project'
import ProjectForm from '@/components/ProjectForm.vue'
import Loader from '@/components/Loader.vue'
import { toast } from 'vue3-toastify'

const projectStore = useProjectStore()
const search = ref('')
const filtroEstado = ref('')

const modal = ref({
  open: false,
  editing: false,
  data: null
})

const confirmDeleteProject = ref(null)

const openCreateModal = () => {
  modal.value = { open: true, editing: false, data: null }
}
const openEditModal = (project) => {
  modal.value = { open: true, editing: true, data: { ...project } }
}
const closeModal = () => {
  modal.value.open = false
  modal.value.data = null
}
const onSubmit = async (data) => {
  try {
    if (modal.value.editing) {
      await projectStore.updateProject(modal.value.data.id, data)
      toast.success("Proyecto actualizado con éxito")
    } else {
      await projectStore.createProject(data)
      toast.success("Proyecto creado con éxito")
    }
    closeModal()
    await projectStore.fetchProjects()
  } catch {
    toast.error("Error al guardar el proyecto")
  }
}
const confirmDelete = (project) => {
  confirmDeleteProject.value = project
}
const deleteProject = async () => {
  if (confirmDeleteProject.value) {
    try {
      await projectStore.deleteProject(confirmDeleteProject.value.id)
      toast.success("Proyecto eliminado")
    } catch {
      toast.error("Error al eliminar proyecto")
    } finally {
      confirmDeleteProject.value = null
      await projectStore.fetchProjects()
    }
  }
}

onMounted(() => projectStore.fetchProjects())

const proyectosFiltrados = computed(() =>
  projectStore.list.filter(p =>
    (filtroEstado.value ? p.status === filtroEstado.value : true) &&
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
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
.add-btn {
  background: #1780fa;
  color: #fff;
  padding: 7px 20px;
  border-radius: 9px;
  font-weight: 600;
  border: none;
  font-size: 1rem;
  box-shadow: 0 1px 4px #2292fa15;
  cursor: pointer;
  transition: background .15s;
}
.add-btn:hover { background: #1467b7;}
.edit-btn {
  background: #e7f0fc;
  color: #1688e9;
  border: none;
  border-radius: 7px;
  padding: 4px 12px;
  margin-right: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background .13s;
}
.edit-btn:hover { background: #d6eafd;}
.delete-btn {
  background: #fae7e7;
  color: #c00d2e;
  border: none;
  border-radius: 7px;
  padding: 4px 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background .13s;
}
.delete-btn:hover { background: #f7c1c1;}
/* Modal */
.modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(30,30,46,0.23);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  padding: 32px 28px 24px 28px;
  border-radius: 18px;
  box-shadow: 0 3px 24px #2a45c810;
  min-width: 320px;
  max-width: 95vw;
}
.modal-title {
  margin-bottom: 14px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2075c8;
  text-align: center;
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
.state-text {
  text-align: center;
  color: #9199ac;
  margin: 30px 0 10px 0;
  font-size: 1.13rem;
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
