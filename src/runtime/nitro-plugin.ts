import type { NitroApp } from 'nitropack'
import { createOpenFetch, useRuntimeConfig } from '#imports'

type NitroAppPlugin = (nitro: NitroApp) => void

function defineNitroPlugin(def: NitroAppPlugin): NitroAppPlugin {
  return def
}

export default defineNitroPlugin((nitroApp) => {
  const clients = useRuntimeConfig().public.openFetch

  Object.entries(clients).forEach(([name, client]) => {
    nitroApp[`$${name}`] = createOpenFetch(client, nitroApp.localFetch, name)
  })
})
