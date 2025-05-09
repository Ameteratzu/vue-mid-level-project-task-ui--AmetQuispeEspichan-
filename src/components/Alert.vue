/* eslint-disable */
<template>
  <div class="p-4 mb-4 bg-red-100 text-red-800 rounded">
    <strong>Error:</strong> {{ props.message }}
  </div>
</template>

<script setup>
const props = defineProps({
  message: { type: String, required: true }
})
</script>
