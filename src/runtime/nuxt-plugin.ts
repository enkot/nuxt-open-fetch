import { createOpenFetch, defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin({
  enforce: 'pre',
  setup() {
    const clients = useRuntimeConfig().public.openFetch
  
    return {
      provide: Object.entries(clients).reduce((acc, [name, client]) => ({
        ...acc,
        [name]: createOpenFetch(client)
      }), {})
    }
  }
})
