export default defineEventHandler(async (event) => {
  console.log('useNuxtOpenFetchServer()', useNuxtOpenFetchServer())
  const { $fetchPets } = useNuxtOpenFetchServer()
  const data = await $fetchPets ("/pet/{petId}", {
    path: {
      petId: 1,
    },
  });

  return ({
    data,
  })
})