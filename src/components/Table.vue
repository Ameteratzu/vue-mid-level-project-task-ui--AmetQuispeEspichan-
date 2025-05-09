<template>
  <table class="min-w-full border-collapse">
    <thead>
      <tr>
        <th
          v-for="col in columns"
          :key="col"
          class="px-4 py-2 bg-gray-200 text-left"
        >
          {{ col }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, idx) in data" :key="idx" class="border-t">
        <td
          v-for="col in columns"
          :key="col"
          class="px-4 py-2"
        >
          {{ row[col] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] }
})

const columns = computed(() =>
  props.data.length ? Object.keys(props.data[0]) : []
)
</script>
