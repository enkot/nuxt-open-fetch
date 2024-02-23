import { defineNitroPlugin, useRuntimeConfig, createOpenFetchServer, nuxtOpenFetchServer } from '#imports'
import type { FetchOptions } from 'ofetch'
import { upperFirst } from 'scule'

export default defineNitroPlugin((nitroApp) => {
  const servers = useRuntimeConfig().public.openFetchServer as Record<string, FetchOptions & { apiRoutePrefix: string }>

  Object.entries(servers).forEach(([name, options]) => {
    nuxtOpenFetchServer[`$fetch${upperFirst(name)}`] = createOpenFetchServer((options) => ({
      ...servers[name],
      ...options,
    }))
  })
})
