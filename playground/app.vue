<script setup lang="ts">
import { ref, useNuxtApp, usePets, useState } from '#imports'

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

const status = useState<'available' | undefined>(() => undefined)
const { data, execute } = await usePets('/pet/findByStatus', {
  immediate: false,
  query: {
    status,
  },
})
</script>

<template>
  <select v-model="status" placeholder="Select a status">
    <option value="available">
      available
    </option>
    <option value="pending">
      pending
    </option>
    <option value="sold">
      sold
    </option>
  </select>
  <pre>{{ data }}</pre>
  <button @click="() => execute()">
    execute
  </button>
</template>
