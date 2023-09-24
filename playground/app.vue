<script setup lang="ts">
const { data, execute } = await usePetsFetch('/pet/{petId}', {
  immediate: false,
  params: {
    petId: 10
  }
})
</script>

<template>
  <pre>{{ data?.name }}</pre>
  <button @click="() => execute()">
    execute
  </button>
</template>
  