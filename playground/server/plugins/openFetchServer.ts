import { useRuntimeConfig } from '#imports'
import { createOpenFetch } from '#imports'

export default defineNitroPlugin((nitroApp) => {
  const { public: { openFetchServer: servers } } = useRuntimeConfig()

  manualNuxtOpenFetch['petsFetch'] = createOpenFetch((options) => ({
    ...servers.pets,
    ...options,
    onRequest(ctx) {
      console.log('Server request', ctx.request)
      return options.onRequest?.(ctx)
    }
  }))
})
