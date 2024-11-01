export default defineNuxtConfig({
  openFetch: {
    // disableNuxtPlugin: true,
    clients: {
      pets: { },
    },
  },
  routeRules: {
    '/petsProxy/**': { proxy: 'https://petstore3.swagger.io/api/v3/**' },
  },
})
