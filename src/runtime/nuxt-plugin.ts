import { createOpenFetch, defineNuxtPlugin, useRequestFetch, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin({
  enforce: 'pre',
  setup() {
    const clients = useRuntimeConfig().public.openFetch
    const $fetch = useRequestFetch()

    return {
      provide: Object.entries(clients).reduce((acc, [name, client]) => ({
        ...acc,
        [name]: createOpenFetch(client, $fetch),
      }), {}),
    }
  },
})
