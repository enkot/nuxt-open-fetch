export default defineNuxtConfig({
  openFetch: {
    disablePlugin: true,
    clients: {
      pets: {
        baseURL: '/petsProxy',
      }
    }
  },
  routeRules: {
    '/petsProxy/**': { proxy: 'https://petstore3.swagger.io/api/v3/**' },
  }
})