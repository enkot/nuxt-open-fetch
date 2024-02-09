<script setup lang="ts">
const { execute: executeOnClient, data: clientData } = await usePetsFetch("/pet/{petId}", {
  path: {
    petId: 1,
  },
  // immediate: false,
});

const { data: serverData, execute: serverExecute, error: serverError } = await useFetch('/api/pets', {
  // immediate: false,
})
</script>

<template>
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
