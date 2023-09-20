
import { ModuleOptions } from './module'

declare module '@nuxt/schema' {
  interface NuxtConfig { ['openFetch']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['openFetch']?: ModuleOptions }
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['openFetch']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['openFetch']?: ModuleOptions }
}


export { ModuleOptions, OpenFetchClientOptions, OpenFetchOptions, SerializableOpenFetchOptions, default } from './module'
