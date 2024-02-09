import NuxtOpenFetch from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    NuxtOpenFetch
  ],
  openFetch: {
    clients: {
      pets: {
        baseURL: 'https://petstore3.swagger.io/api/v3'
      },
    },
    servers: {
      pets: {
        baseURL: 'https://petstore3.swagger.io/api/v3'
      },
    },
  },
})
