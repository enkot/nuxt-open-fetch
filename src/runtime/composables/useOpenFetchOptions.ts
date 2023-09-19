import type { OpenFetchOptions } from '../../module'
import type { OpenFetchClientName } from '#build/module/nuxt-open-fetch'
import { useNuxtApp } from '#app'

type OpenFetchOptionsCb<T> = ((options: T) => OpenFetchOptions)

export function useOpenFetchOptions(options: OpenFetchOptions | OpenFetchOptionsCb<Record<OpenFetchClientName, OpenFetchOptions>>): void
export function useOpenFetchOptions(name: OpenFetchClientName, options: OpenFetchOptions | OpenFetchOptionsCb<OpenFetchOptions>): void
export function useOpenFetchOptions(arg1: OpenFetchClientName | OpenFetchOptions | OpenFetchOptionsCb<any>, arg2?: OpenFetchOptions | OpenFetchOptionsCb<any>) {
  const { $openFetch } = useNuxtApp()
  const [options = {}, name] = typeof arg1 === 'string' ? [arg2, arg1] : [arg1]
  
  if (name) {
    $openFetch[name] = typeof options === 'function' 
      ? options(name ? $openFetch[name] : $openFetch) 
      : {
        ...$openFetch[name],
        ...options
      }

    return
  }

  Object.keys($openFetch).forEach((_name) => useOpenFetchOptions(_name as OpenFetchClientName, options))
}