<script setup lang="ts">
const { data } = await usePetsFetch('/pet/{petId}', {
  params: {
    petId: 1
  }
})
</script>

<template>
  <pre>{{ data }}</pre>
</template>