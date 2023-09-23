<script setup lang="ts">
const { data } = await usePetsFetch('/pet/{petId}', {
  params: {
    petId: 10
  }
})
</script>

<template>
  <pre>{{ data?.name }}</pre>
</template>
  