import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { OpenFetchOptions } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  if (nuxtApp.$openFetch) return
 
  const clients = useRuntimeConfig().public.openFetch.clients as Record<string, {
    fetchOptions: OpenFetchOptions
  }>
  
  return {
    provide: {
      openFetch: Object.entries(clients || {}).reduce((acc, [name, client]) => ({
        ...acc,
        [name]: client.fetchOptions
      }), {})
    }
  }
})