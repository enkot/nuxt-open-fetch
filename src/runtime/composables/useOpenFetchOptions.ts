import type { OpenFetchOptions } from '#imports'
import type { OpenFetchClientName } from '#build/nuxt-open-fetch'
import { useNuxtApp } from '#app'

type GlobalOpenFetchOptions = OpenFetchOptions | ((options: OpenFetchOptions) => OpenFetchOptions)

export function useOpenFetchOptions(options: GlobalOpenFetchOptions): void
export function useOpenFetchOptions(name: OpenFetchClientName, options: GlobalOpenFetchOptions): void
export function useOpenFetchOptions(arg1: OpenFetchClientName | GlobalOpenFetchOptions, arg2?: GlobalOpenFetchOptions) {
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