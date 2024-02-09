import { defineNitroPlugin, useRuntimeConfig, createOpenFetch, nuxtOpenFetchServer } from '#imports'
import type { FetchOptions } from 'ofetch'
import { upperFirst } from 'scule'

export default defineNitroPlugin((nitroApp) => {
  const servers = useRuntimeConfig().public.openFetchServer as Record<string, FetchOptions>

  Object.entries(servers).forEach(([name, options]) => {
    nuxtOpenFetchServer[`$fetch${upperFirst(name)}`] = createOpenFetch((options) => ({
      ...servers[name],
      ...options,
    }))
  })
})
