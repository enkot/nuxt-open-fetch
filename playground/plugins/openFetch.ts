export default defineNuxtPlugin(() => {
  useOpenFetchOptions('pets', (globalOptions) => {
    return {
      ...globalOptions,
      onResponse({ response }) {
        console.log('----onResponse----', response._data)
      }
    }
  })
})