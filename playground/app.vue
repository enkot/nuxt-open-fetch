<script setup lang="ts">
const { execute } = await usePetsFetch('/pet/{petId}', {
  path: {
    petId: 1,
  }
})

// const result = await $petsFetch('/pet', {
//   method: 'post',
//   body: {
//     name: 'david',
//     photoUrls: ['https://www.baidu.com']
//   }
// })

</script>

<template>
  <button @click="() => execute()">
    execute
  </button>
</template>
  