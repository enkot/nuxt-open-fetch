import { upperFirst } from 'scule'

export default defineNitroPlugin((nitroApp) => {
  const { public: { openFetchServer: servers } } = useRuntimeConfig()

  Object.entries(servers).forEach(([name, options]) => {
    nuxtOpenFetchServer[`$fetch${upperFirst(name)}`] = createOpenFetch((options) => ({
      ...servers[name],
      ...options,
    }))
  })
})
