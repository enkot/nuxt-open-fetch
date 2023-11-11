import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import type { FetchOptions } from 'ofetch'

export default defineNuxtPlugin(() => {
  const clients = useRuntimeConfig().public.openFetch as Record<string, FetchOptions>

  return {
    provide: Object.entries(clients).reduce((acc, [name, client]) => ({
      ...acc,
      [`${name}Fetch`]: createOpenFetch(client)
    }), {})
  }
})