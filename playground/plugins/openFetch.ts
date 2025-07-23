import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  enforce: 'pre',
  setup(nuxtApp) {
    nuxtApp.hook('openFetch:onRequest', (ctx) => {
      ctx.options.headers.set('X-Custom-Header', 'MyValue-nuxt')
    })

    nuxtApp.hook('openFetch:onResponse:api', (ctx) => {
      console.warn('Response from API:', ctx.response)
    })
  },
})
