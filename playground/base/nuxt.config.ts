export default defineNuxtConfig({
  modules: ['../src/module'],
  openFetch: {
    clients: {
      uspto: {
        fetchOptions: {
          baseURL: 'https://developer.uspto.gov/ds-api/',
        }
      }
    }
  }
})

// https://petstore3.swagger.io/api/v3/pet/12
