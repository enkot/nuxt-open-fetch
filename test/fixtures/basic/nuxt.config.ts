import NuxtOpenFetch from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    NuxtOpenFetch,
  ],
  openFetch: {
    clients: {
      pets: {
        baseURL: '/api',
      },
    },
  },
})
