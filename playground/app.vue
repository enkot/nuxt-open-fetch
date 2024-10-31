<script setup lang="ts">
import { ref, useApi, useNuxtApp } from '#imports'

// const { $api } = useNuxtApp()

const petId = ref(1)

// const res = await $api('/pet/{petId}', {
//   path: {
//     petId: petId.value,
//   },
// })

// await $pets('/store/order', {
//   method: 'POST',
//   body: {
//     petId: petId.value,
//   },
// })

const { data, execute } = await useApi('/pet/{petId}', {
  immediate: false,
  path: {
    petId,
  },
})
</script>

<template>
  <h1>Playground</h1>
  <pre>{{ data }}</pre>
  <button @click="() => execute()">
    execute
  </button>
</template>
