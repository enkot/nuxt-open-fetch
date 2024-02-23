import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createOpenFetch, createOpenFetchServerClient, FetchOptionsServer } from '#imports'
import type { FetchOptionsServer } from '#imports'
import type { FetchOptions } from 'ofetch'

export default defineNuxtPlugin({
  enforce: 'pre',
  setup() {
    const clients = useRuntimeConfig().public.openFetch as Record<string, FetchOptions>
    const servers = useRuntimeConfig().public.openFetchServer as Record<string, FetchOptionsServer>

    return {
      provide: {
        // Add client providers
        ...Object.entries(clients).reduce((acc, [name, client]) => ({
          ...acc,
          [`${name}Fetch`]: createOpenFetch(client)
        }), {}),
        // Add server providers
        ...Object.entries(servers).reduce((acc, [name, server]) => {
          // We point the server client to the nuxt server here instead of the OpenAPI base url
          const {baseURL: _, ...serverOptions} = server
          return {
            ...acc,
            [`${name}FetchServer`]: createOpenFetchServerClient(serverOptions)
          }
        }, {}),
      }
    }
}
})

