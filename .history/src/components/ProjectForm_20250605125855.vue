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
        :class="{ 'input-error': errors.name }"
      />
      <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
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
      <button type="submit" class="save-btn" :disabled="submitting">
        <span v-if="submitting" class="loader-btn"></span>
        {{ project ? "Guardar cambios" : "Crear proyecto" }}
      </button>
      <button type="button" class="cancel-btn" @click="$emit('cancel')">
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

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
const errors = reactive({})
const submitting = ref(false)

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
    errors.name = ''
  },
  { immediate: true }
)

function handleSubmit() {
  errors.name = ''
  if (!form.name) {
    errors.name = 'El nombre es obligatorio'
    return
  }
  submitting.value = true
  emit('submit', { name: form.name, status: form.status })
  setTimeout(() => { // simula delay, reemplaza con await si quieres
    submitting.value = false
  }, 500)
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
.input-error {
  border-color: #e53e3e;
}
.error-text {
  color: #e53e3e;
  font-size: 0.96rem;
}
.loader-btn {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2.5px solid #3b82f6;
  border-radius: 50%;
  border-top-color: transparent;
  margin-right: 6px;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
}
@keyframes spin { to { transform: rotate(360deg);} }
</style>
