<script setup lang="ts">
import { usePetsFetch, useRoute, useFetch, useLazyPetsFetch, computed, useNuxtApp, ref } from "#imports";
import { c } from "vitest/dist/reporters-5f784f42.js";

const petId = ref(2)


const { data, error } = useLazyPetsFetch("/pet/{petId}", {
  path: {
    petId: 2
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

const {data: data2 } = useFetch('/api/hello', {
  transform(input) {
    return {
      foo: 'bar'
    } 
  }
})

// const { execute } = usePetsFetch('/user/{username}', {
//   method: 'put',
//   path: {
//     username: 'tony'
//   },
//   immediate: false,
//   body: {
//     email: 'tony@stark.com'
//   }
// })
</script>

<template>
  <button @click="() => execute()">
    execute
  </button>
</template>
