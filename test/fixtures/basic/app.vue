<template>
  <div>{{ data.name }}</div>
</template>

<script setup>
import { usePetsFetch } from '#imports'

const { data } = await usePetsFetch('/pet/{petId}', {
  path: {
    petId: 1
  }
})
</script>
