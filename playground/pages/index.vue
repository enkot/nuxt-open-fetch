<script setup lang="ts">
const {
  execute: usePetsFetchExecute,
  data: usePetsFetchData,
  error: usePetsFetchError,
} = await usePetsFetch("/pet/{petId}", {
  path: {
    petId: 1,
  },
  immediate: false,
});

const {
  execute: usePetsProxyFetchExecute,
  data: usePetsProxyFetchData,
  error: usePetsProxyFetchError,
} = await usePetsProxyFetch("/pet/{petId}", {
  path: {
    petId: 1,
  },
  immediate: false,
});

const {
  data: useFetchData,
  execute: useFetchExecute,
  error: useFetchError,
} = await useFetch("/api/manual/pet/1", {
  immediate: false,
});

const {
  data: usePetsFetchServerData,
  execute: usePetsFetchServerExecute,
  error: usePetsFetchServerError,
} = await usePetsFetchServer("/pet/{petId}", {
  immediate: false,
  path: {
    petId: 1,
  },
});

const { $manualPetsFetch } = useNuxtApp()

const petId = ref(2)

const data = await $manualPetsFetch('/pet/{petId}', {
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
    @click="() => usePetsFetchExecute()"
  >
    usePetsFetch
  </button>
  <pre
    v-if="usePetsFetchData"
    data-test="client-result"
  >
    clientData: {{ usePetsFetchData }} {{ usePetsFetchError }}
  </pre>
  <button
    data-test="proxy-button"
    @click="() => usePetsProxyFetchExecute()"
  >
    usePetsProxyFetch
  </button>
  <pre
    v-if="usePetsProxyFetchData"
    data-test="proxy-result"
  >
    clientData: {{ usePetsProxyFetchData }} {{ usePetsProxyFetchError }}
  </pre>
  <button
    data-test="server-button"
    @click="() => useFetchExecute()"
  >
    useFetch
  </button>
  <pre
    v-if="useFetchData || useFetchError"
    data-test="server-result"
  >
    serverData: {{ useFetchData }} {{ useFetchError }}
  </pre>
  <button
    data-test="server-route-button"
    @click="() => usePetsFetchServerExecute()"
  >
    usePetsFetchServer
  </button>
  <pre
    v-if="usePetsFetchServerData || usePetsFetchServerError"
    data-test="server-route-result"
  >
    serverData: {{ usePetsFetchServerData }} {{ usePetsFetchServerError }}
  </pre>
</template>
