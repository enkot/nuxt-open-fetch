<template>
  <div>
    Nuxt module playground!
    <input
      v-model="id"
      type="text"
    >
    <!-- <button @click="sendRequest">
      Send
    </button> -->
    Data:
    <pre>{{ data }}</pre>
    Error:
    <pre>{{ error }}</pre>
  </div>
</template>

<script setup lang="ts">
const id = ref('10')

// const { data, error } = useFetch('/api/hello', { 
//   server: false,
//   transform: (input) => ({
//     df: 'df',
//     ...input
//   }),
//   default: () => ({
//     df: 'df',
//   }),
// })
// const data = ref()

const { data, error } = await usePetsFetch('/pet/{petId}', {
  params: computed(() => ({
    petId: +id.value
  }))
})
</script>

