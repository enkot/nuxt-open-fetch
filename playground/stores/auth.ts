import { defineStore, useNuxtApp } from "#imports"

export const useAuth = defineStore(
  "auth",
  () => {
    const { $petsFetch } = useNuxtApp()

    async function init() {
      await $petsFetch('/pet/{petId}', { path: { petId: 4 }}).catch(() => {})
      await $petsFetch('/pet/{petId}', { path: { petId: 4 }}).catch(() => {})
    }

    return {
      init,
    }
  },
)