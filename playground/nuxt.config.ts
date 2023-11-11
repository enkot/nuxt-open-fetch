export default defineNuxtConfig({
  modules: ['../src/module'],
  extends: ['./pets'],
  devtools: { enabled: false },
  openFetch: {
    clients: {
      foo: {
        baseURL: '/petsProxy'
      },
    },
  },
  runtimeConfig: {
    openFetch: {
      pets: {
        baseURL: '/petsProxy',
      },
    },
  },
})
