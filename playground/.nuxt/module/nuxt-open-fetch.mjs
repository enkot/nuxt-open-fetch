import { createOpenFetchClient, createUseOpenFetchClient, createUseLazyOpenFetchClient } from '/Users/tarasbatenkov/Projects/nuxt-open-fetch/src/clients'

export const $petsFetch = createOpenFetchClient('pets')
export const usePetsFetch = createUseOpenFetchClient('pets')
export const useLazyPetsFetch = createUseLazyOpenFetchClient('pets')
