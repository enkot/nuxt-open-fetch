export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@pinia/nuxt',
  ],
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
