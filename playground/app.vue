<script setup lang="ts">
import { useApi } from '#imports'

const { data, execute } = await useApi('/pet/{petId}', {
  immediate: false,
  path: {
    petId: 1,
  },
})

const { data: value } = await useApi('/pet/{petId}', {
  path: {
    petId: 3,
  },
})
</script>

<template>
  <h1>Playground</h1>
  <pre>{{ data }}</pre>
  <pre>{{ value }}</pre>
  <button @click="() => execute()">
    execute
  </button>
</template>
