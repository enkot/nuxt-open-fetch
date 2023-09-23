import type { OpenFetchOptions } from '#imports'
import type { OpenFetchClientName } from '#build/module/nuxt-open-fetch'
import { useNuxtApp } from '#app'

type OpenFetchOptionsCb = ((options: OpenFetchOptions) => OpenFetchOptions)

export function useOpenFetchOptions(options: OpenFetchOptions | OpenFetchOptionsCb): void
export function useOpenFetchOptions(name: OpenFetchClientName, options: OpenFetchOptions | OpenFetchOptionsCb): void
export function useOpenFetchOptions(arg1: OpenFetchClientName | OpenFetchOptions | OpenFetchOptionsCb, arg2?: OpenFetchOptions | OpenFetchOptionsCb) {
  const { $openFetch } = useNuxtApp()
  const [options = {}, name] = typeof arg1 === 'string' ? [arg2, arg1] : [arg1]
  
  if (name) {
    $openFetch[name] = typeof options === 'function'
      ? options($openFetch[name])
      : {
        ...$openFetch[name],
        ...options
      }

    return
  }

  Object.keys($openFetch).forEach((_name) => useOpenFetchOptions(_name as OpenFetchClientName, options))
}