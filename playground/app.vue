<script setup lang="ts">
const { execute, data } = await usePetsFetch('/pet/{petId}', {
  path: {
    petId: 12,
  },
  immediate: false,
})
</script>

<template>
  <button @click="() => execute()">
    execute
  </button>
</template>
  