<script setup lang="ts">
import { ref, useLazyApi, usePets, useNuxtApp } from "#imports"

const { $pets } = useNuxtApp()

const petId = ref(2)

const data = await $pets('/pet/{petId}', {
  path: {
    petId: petId.value
  }
})

const { data: data2, error, execute } = await usePets('/pet/{petId}', {
  immediate: false,
  path: {
    petId
  }
})

const {data: data3 } = useLazyApi('/pet/{petId}', {
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
