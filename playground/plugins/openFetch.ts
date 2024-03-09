import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createOpenFetch } from "#imports"

export default defineNuxtPlugin({
  enforce: 'pre',
  setup() {
    const { public: { openFetch: clients } } = useRuntimeConfig()
  
    return {
      provide: Object.entries(clients).reduce((acc, [name, client]) => ({
        ...acc,
        [name]: createOpenFetch((options) => ({
          ...client,
          ...options,
          onRequest(ctx) {
            console.log('My logging', ctx.request)
            return options.onRequest?.(ctx)
          }
        }))
      }), {})
    }
  }
})
