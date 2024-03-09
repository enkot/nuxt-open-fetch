<template>
  <div>{{ data.name }}</div>
</template>

<script setup>
import { usePets } from '#imports'

const { data } = await usePets('/pet/{petId}', {
  path: {
    petId: 1
  }
})
</script>
