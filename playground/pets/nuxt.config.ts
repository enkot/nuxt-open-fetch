export default defineNuxtConfig({
  modules: ['../src/module'],
  openFetch: {
    clients: {
      pets: {
        fetchOptions: {
          baseURL: 'https://petstore3.swagger.io/api/v3'
        }
      }
    }
  }
})