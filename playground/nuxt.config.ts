export default defineNuxtConfig({
  modules: ['../src/module'],
  extends: ['./petsProxy'],
  devtools: { enabled: true },
  openFetch: {
    clients: {
      foo: {
        baseURL: '/petsProxy'
      },
      pets: {
        baseURL: 'https://petstore3.swagger.io/api/v3'
      },
      petsProxy: {
        baseURL: 'https://petstore3.swagger.io/api/v3'
      },
    },
    servers: {
      pets: {
        baseURL: 'https://petstore3.swagger.io/api/v3'
      },
    },
  },
  runtimeConfig: {
    openFetch: {
      clients: {
        petsProxy: {
          baseURL: '/petsProxy',
        },
      }
    },
  },
})
