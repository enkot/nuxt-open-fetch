import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createOpenFetch } from "#imports"

export default defineNuxtPlugin({
  enforce: 'pre',
  setup() {
    const { public: { openFetch: clients } } = useRuntimeConfig()

    return {
      provide: {
        petsFetch: createOpenFetch((options) => ({
          ...clients.pets,
          ...options,
          onRequest(ctx) {
            console.log('My logging', ctx.request)
            return options.onRequest?.(ctx)
          }
        }))
      }
    }
  }
})
