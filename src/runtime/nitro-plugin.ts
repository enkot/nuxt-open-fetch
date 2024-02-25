import type { NitroApp } from 'nitropack'
import type { FetchOptions } from 'ofetch'
import { useRuntimeConfig, createOpenFetch } from '#imports'

type NitroAppPlugin = (nitro: NitroApp) => void

function defineNitroPlugin(def: NitroAppPlugin): NitroAppPlugin {
  return def
}

export default defineNitroPlugin((nitroApp) => {
  const clients = useRuntimeConfig().public.openFetch as Record<string, FetchOptions>

  Object.entries(clients).forEach(([name, client]) => {
    // @ts-expect-error - This is a dynamic property
    nitroApp[`$${name}Fetch`] = createOpenFetch(client)
  })
})