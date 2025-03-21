export default defineNuxtConfig({
  modules: ['../src/module'],
  extends: ['./pets'],
  devtools: { enabled: true },

  openFetch: {
    clients: {
      api: {
        baseURL: 'https://petstore3.swagger.io/api/v3/',
      },
    },
  },

  runtimeConfig: {
    public: {
      openFetch: {
        pets: {
          baseURL: '/petsProxy',
        },
      },
    },
  },

  compatibilityDate: '2025-03-21',
})
