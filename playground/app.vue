<script setup lang="ts">
import { ref, useLazyApiFetch, usePetsFetch, useNuxtApp } from "#imports"

const { $petsFetch } = useNuxtApp()

const petId = ref(2)

const data = await $petsFetch('/pet/{petId}', {
  path: {
    petId: petId.value
  }
})

const { data: data2, error, execute } = await usePetsFetch('/pet/{petId}', {
  immediate: false,
  path: {
    petId
  }
})

const {data: data3 } = useLazyApiFetch('/pet/{petId}', {
  path: {
    petId
  },
  transform(input) {
    return {
      name: input.name,
      age: input.status
    }
  },
  default() {
    return {
      foo: 'bar'
    }
  }
})
</script>

<template>
  <button @click="() => execute()">
    execute
  </button>
</template>
