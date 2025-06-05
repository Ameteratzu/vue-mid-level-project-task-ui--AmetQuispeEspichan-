<template>
  <div class="loader-overlay">
    <div class="loader"></div>
  </div>
</template>

<script setup>
// Este componente no necesita lógica.
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.60);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader {
  border: 4px solid #3b82f6;           /* Azul base */
  border-top-color: transparent;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
  box-shadow: 0 1px 10px #3b82f620;
}
@keyframes spin {
  to { transform: rotate(360deg);}
}
</style>
