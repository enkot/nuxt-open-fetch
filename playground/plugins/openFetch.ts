import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  enforce: 'pre',
  setup(nuxtApp) {
    nuxtApp.hook('openFetch:onRequest', (ctx) => {
      ctx.options.headers.set('X-Custom-Header', 'MyValue-nuxt')
    })

    // const { public: { openFetch: clients } } = useRuntimeConfig()
    // const $fetch = useRequestFetch()

    // return {
    //   provide: Object.entries(clients).reduce((acc, [name, client]) => ({
    //     ...acc,
    //     [name]: createOpenFetch(options => ({
    //       ...client,
    //       ...options,
    //       onRequest(ctx) {
    //         // eslint-disable-next-line no-console
    //         console.log('My logging', ctx.request)
    //         return options.onRequest?.(ctx)
    //       },
    //     }), $fetch),
    //   }), {}),
    // }
  },
})
