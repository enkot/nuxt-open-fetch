import { defineNuxtPlugin, useRequestFetch, useRuntimeConfig } from '#imports'
import { createOpenFetch } from './fetch'

export default defineNuxtPlugin({
  enforce: 'pre',
  setup(nuxtApp) {
    const clients = useRuntimeConfig().public.openFetch
    const $fetch = useRequestFetch()

    return {
      provide: Object.entries(clients as any).reduce((acc, [name, client]) => ({
        ...acc,
        [name]: createOpenFetch(client as any, $fetch as any, name, nuxtApp.hooks),
      }), {}),
    }
  },
})
