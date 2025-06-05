<template>
  <form @submit.prevent="handleSubmit" class="project-form">
    <div class="form-group">
      <label for="name">Nombre del proyecto</label>
      <input
        v-model.trim="form.name"
        id="name"
        type="text"
        required
        class="form-input"
        placeholder="Ejemplo: Sistema Contable"
      />
    </div>
    <div class="form-group">
      <label for="status">Estado</label>
      <select
        v-model="form.status"
        id="status"
        required
        class="form-input"
      >
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
      </select>
    </div>
    <div class="form-btns">
      <button type="submit" class="save-btn">
        {{ project ? "Guardar cambios" : "Crear proyecto" }}
      </button>
      <button type="button" class="cancel-btn" @click="$emit('cancel')">
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  name: '',
  status: 'active'
})

// Si recibimos un proyecto, cargamos los datos para editar
watch(
  () => props.project,
  (newVal) => {
    if (newVal) {
      form.name = newVal.name || ''
      form.status = newVal.status || 'active'
    } else {
      form.name = ''
      form.status = 'active'
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.name) return
  emit('submit', { name: form.name, status: form.status })
}
</script>

<style scoped>
.project-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 270px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
label {
  font-weight: 500;
  color: #345179;
  margin-bottom: 2px;
}
.form-input {
  border: 1px solid #b7c9e9;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1rem;
  outline: none;
  transition: border .15s;
}
.form-input:focus {
  border-color: #1780fa;
}
.form-btns {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 6px;
}
.save-btn {
  background: #1780fa;
  color: #fff;
  padding: 7px 19px;
  border-radius: 9px;
  font-weight: 600;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background .13s;
}
.save-btn:hover {
  background: #1467b7;
}
.cancel-btn {
  background: #f0f4fa;
  color: #1968a9;
  padding: 7px 15px;
  border-radius: 9px;
  font-weight: 600;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background .13s, color .13s;
}
.cancel-btn:hover {
  background: #e3eaf7;
  color: #145799;
}
</style>
