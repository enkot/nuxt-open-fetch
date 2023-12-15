<script setup lang="ts">
import { usePetsFetch } from "#imports";

const { execute, data } = await usePetsFetch("/pet/{petId}", {
  path: {
    petId: 4,
  },
  immediate: false,
});
</script>

<template>
  <button @click="() => execute()">
    execute
  </button>
</template>
