export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },

  openFetch: {
    clients: {
      api: {
        baseURL: 'http://localhost:3000/api',
      },
    },
  },

  compatibilityDate: '2025-03-21',
})
