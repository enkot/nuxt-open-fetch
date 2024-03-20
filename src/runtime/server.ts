import type { $Fetch, FetchOptions } from 'ofetch'
import { $fetch } from 'ofetch'
import type { OpenFetchClientName, UseOpenFetchClient } from '#build/nuxt-open-fetch/clients'
import { fillPath } from '#build/nuxt-open-fetch/utils'

export type FetchOptionsServer = FetchOptions & { apiRoutePrefix: string }

export function createOpenFetchServer(options: FetchOptionsServer | ((options: FetchOptionsServer | undefined) => FetchOptionsServer)): (url: string, opts: any) => Promise<any> {
  return (url: string, opts: any): Promise<any> => {
    const params = typeof options === 'function' ? options(opts) : {
      ...options ?? {},
      ...opts
    }
    return $fetch(
      fillPath(addBaseURL(url, params.baseURL), opts.path), params)
  }
}

export function createOpenFetchServerClient(options: FetchOptionsServer | ((options: FetchOptionsServer) => FetchOptionsServer)) {
  return (url: string, opts: any) => {
    return $fetch(
      fillPath(`${options.apiRoutePrefix}${url}`, opts.path),
      typeof options === 'function' ? options(opts) : {
        ...options,
        ...opts,
      }
    )
  }
}

export function createUseOpenFetchServer<Paths, Lazy extends boolean = boolean>(server: $Fetch | OpenFetchClientName, lazy?: Lazy): UseOpenFetchClient<Paths, Lazy> {
  return (url: string | (() => string), options: any = {}, autoKey?: string) => {
    const nuxtApp = useNuxtApp()
    const $fetch = (typeof server === 'string' ? nuxtApp[`$${server}FetchServer`] : server)
    const opts = { $fetch, key: autoKey, ...options }

    return useFetch(() => url, lazy ? { ...opts, lazy } : opts)
  }
}

export function addBaseURL(url: string, baseURL: string | undefined) {
  return `${(baseURL ?? '').replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}
