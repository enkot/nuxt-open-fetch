export default defineNuxtConfig({
  modules: ['../src/module'],
  extends: ['./pets'],
  devtools: { enabled: true },

  openFetch: {
    clients: {
      api: {
        baseURL: 'http://localhost:3000/api',
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
