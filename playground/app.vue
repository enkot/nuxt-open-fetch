<script setup lang="ts">
import { useLazyPetsFetch, ref } from "#imports";

const petId = ref(2)

const { data, error, execute } = useLazyPetsFetch("/pet/{petId}", {
  immediate: false,
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

// const {data: data2 } = useFetch('/api/hello', {
//   transform(input) {
//     return {
//       foo: 'bar'
//     } 
//   }
// })

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
