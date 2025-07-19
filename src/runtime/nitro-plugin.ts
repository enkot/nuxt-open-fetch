// @ts-ignore
import { defineNitroPlugin, useRuntimeConfig } from '#imports'
import { createOpenFetch } from './fetch'

// @ts-ignore
export default defineNitroPlugin((nitroApp) => {
  const clients = useRuntimeConfig().public.openFetch

  // @ts-ignore
  Object.entries(clients).forEach(([name, client]) => {
    // @ts-ignore
    nitroApp[`$${name}`] = createOpenFetch(client, nitroApp.localFetch, name)
  })
})
