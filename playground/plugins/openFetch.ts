export default defineNuxtPlugin(() => {
  useOpenFetchOptions((globalOptions) => {
    return {
      ...globalOptions,
      onResponse({ response }) {
        console.log('----onResponse----', response._data)
      }
    }
  })
})