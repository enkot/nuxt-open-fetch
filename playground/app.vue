<script setup lang="ts">
const { execute: executeOnClient, data: clientData } = await usePetsFetch("/pet/{petId}", {
  path: {
    petId: 1,
  },
  immediate: false,
});

const { data: serverData, execute: serverExecute, error: serverError } = await useFetch('/api/pets', {
  immediate: false,
})

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

const {data: data3 } = useLazyPetsFetch('/pet/{petId}', {
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
  <button
    data-test="client-button"
    @click="() => executeOnClient()"
  >
    execute on client
  </button>
  <pre
    v-if="clientData"
    data-test="client-result"
  >
    clientData: {{ clientData }}
  </pre>
  <button
    data-test="server-button"
    @click="() => serverExecute()"
  >
    fetch from server
  </button>
  <pre
    v-if="serverData || serverError"
    data-test="server-result"
  >
    serverData: {{ serverData }} {{ serverError }}
  </pre>
</template>
