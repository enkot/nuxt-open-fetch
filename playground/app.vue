<script setup lang="ts">
import { ref, useNuxtApp, usePets } from '#imports'

const { $pets } = useNuxtApp()

const petId = ref(2)

await $pets('/pet/{petId}', {
  path: {
    petId: petId.value,
  },
})

await $pets('/store/order', {
  method: 'POST',
  body: {
    petId: petId.value,
  },
})

const { data, execute } = await usePets('/pet/{petId}', {
  immediate: false,
  path: {
    petId,
  },
})
</script>

<template>
  <pre>{{ data }}</pre>
  <button @click="() => execute()">
    execute
  </button>
</template>
