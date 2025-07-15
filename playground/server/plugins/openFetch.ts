export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('openFetch:onRequest', (ctx) => {
    ctx.options.headers.set('X-Custom-Header', 'MyValue-nitro')
  })
})
