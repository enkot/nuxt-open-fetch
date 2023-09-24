export default defineNuxtConfig({
  modules: ['../src/module'],
  openFetch: {
    clients: {
      pets: {
        fetchOptions: {
          baseURL: '/petsProxy'
        }
      }
    }
  },
  routeRules: {
    '/petsProxy/**': { proxy: 'https://petstore3.swagger.io/api/v3/**' },
  }
})