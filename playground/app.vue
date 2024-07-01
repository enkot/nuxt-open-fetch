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

const statusAsRef = useState<'available' | 'pending' | 'sold' | undefined>(() => undefined)

const { data, execute } = await usePets('/pet/findByStatus', {
  immediate: false,
  query: {
    status: statusAsRef,
  },
})
</script>

<template>
  <select v-model="statusAsRef" placeholder="Select a status">
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
