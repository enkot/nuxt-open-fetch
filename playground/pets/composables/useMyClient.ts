import type { paths as PetsPaths } from '#build/types/nuxt-open-fetch/pets'

export const useMyClient = createUseOpenFetchClient<PetsPaths>('pets')