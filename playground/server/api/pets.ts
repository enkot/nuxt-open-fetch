export default defineEventHandler(async (event) => {
  const { $fetchPets } = useNuxtOpenFetchServer()
  const data = await $fetchPets("/pet/{petId}", {
    path: {
      petId: 1,
    },
  });

  return data;
})
