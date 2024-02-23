export default defineEventHandler(async (event) => {
  const { petsFetch } = useManualNuxtOpenFetch()
  const data = await petsFetch("/pet/{petId}", {
    path: {
      petId: 1,
    },
  });

  return ({
    data,
  })
})