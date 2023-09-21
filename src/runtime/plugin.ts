import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  if (nuxtApp.$openFetch) return
 
  const clients = useRuntimeConfig().public.openFetch.clients as Record<string, {
    fetchOptions: any
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