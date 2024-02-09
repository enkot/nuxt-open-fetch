export default defineNuxtConfig({
  openFetch: {
    disablePlugin: false, // was true in the original - don't know why, because it overwrites everything on the upper level
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