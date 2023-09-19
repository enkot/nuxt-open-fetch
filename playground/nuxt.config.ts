export default defineNuxtConfig({
  extends: ['./pets', './base'],
  devtools: { enabled: true },
  imports: {
    autoImport: true
  },
})

// https://petstore3.swagger.io/api/v3/pet/12
