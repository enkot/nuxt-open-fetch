import type { ModuleOptions } from '../module'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  if (nuxtApp.$openFetch) return
 
  const openFetch = useRuntimeConfig().public.openFetch as ModuleOptions
  
  return {
    provide: {
      openFetch: Object.entries(openFetch.clients || {}).reduce((clients, [name, client]) => ({
        ...clients,
        [name]: client.fetchOptions
      }), {})
    }
  }
})