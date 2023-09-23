import type { Ref } from 'vue'
import type { FetchOptions as _FetchOptions } from 'ofetch'
import type { ErrorResponse, HttpMethod, SuccessResponse, FilterKeys, MediaType, ResponseObjectMap } from "openapi-typescript-helpers"
import type { KeysOf, MultiWatchSources, AsyncDataOptions, AsyncData, PickFrom } from "#app/composables/asyncData"
import type { OpenFetchClientName } from '#build/module/nuxt-open-fetch'
import { toValue, unref, computed, useNuxtApp, useFetch, useLazyFetch } from '#imports'
import { fillPath } from './utils'

const interceptors = ['onRequest', 'onResponse', 'onRequestError', 'onResponseError'] as const

type FetchResponseData<T> = FilterKeys<SuccessResponse<ResponseObjectMap<T>>, MediaType>
type FetchResponseError<T> = FilterKeys<ErrorResponse<ResponseObjectMap<T>>, MediaType>
type ComputedOptions<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Function ? T[K] : T[K] extends Record<string, any> ? ComputedOptions<T[K]> | Ref<T[K]> | T[K] : Ref<T[K]> | T[K]
}
type ParamsOption<T = void> = T extends { parameters: any } ? NonNullable<T["parameters"]> : { query: Record<string, unknown> }

export interface OpenFetchOptions extends Omit<_FetchOptions, 'method' | 'params'> { }
interface FetchOptions<M extends HttpMethod, P extends { path?: unknown, query?: unknown }> extends Omit<OpenFetchOptions, 'query'> {
  params?: P extends { path: any } ? P['path'] : never
  query?: P['query']
  method?: M
}
type ComputedFetchOptions<M extends HttpMethod, P extends { path?: unknown, query?: unknown }> = ComputedOptions<FetchOptions<M, P>>

export interface UseFetchOptions<
  Method extends HttpMethod,
  Params extends { path?: any, query?: any },
  ResT,
  DataT = ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = null,
> extends Omit<AsyncDataOptions<ResT, DataT, PickKeys, DefaultT>, 'watch'>, ComputedFetchOptions<Method, Params> {
  key?: string
  $fetch?: typeof globalThis.$fetch
  watch?: MultiWatchSources | false
}

export type OpenFetchClient<Paths> = <
  ReqT extends Extract<keyof Paths, string>,
  PathT extends Extract<keyof Paths[ReqT], HttpMethod>,
  Method extends PathT = 'get' extends PathT ? 'get' : PathT,
  ResT = FetchResponseData<'get' extends Method ? Paths[ReqT]['get'] : Paths[ReqT][Method]>
>(
  path: ReqT,
  options?: FetchOptions<Method, ParamsOption<'get' extends Method ? Paths[ReqT]['get'] : Paths[ReqT][Method]>>
) => Promise<ResT>

export type UseOpenFetchClient<Paths> = <
  ReqT extends Extract<keyof Paths, string>,
  Method extends Extract<keyof Paths[ReqT], HttpMethod>,
  ResT = FetchResponseData<'get' extends Method ? Paths[ReqT]['get'] : Paths[ReqT][Method]>,
  ErrorT = FetchResponseError<'get' extends Method ? Paths[ReqT]['get'] : Paths[ReqT][Method]>,
  DataT = ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = null,
>(
  path: ReqT | (() => ReqT),
  options?: UseFetchOptions<Method, ParamsOption<'get' extends Method ? Paths[ReqT]['get'] : Paths[ReqT][Method]>, ResT, DataT, PickKeys, DefaultT>,
  autoKey?: string
) => AsyncData<PickFrom<DataT, PickKeys> | DefaultT, ErrorT | null>

export type UseLazyOpenFetchClient<Paths> = <
  ReqT extends Extract<keyof Paths, string>,
  Method extends Extract<keyof Paths[ReqT], HttpMethod>,
  ResT = FetchResponseData<'get' extends Method ? Paths[ReqT]['get'] : Paths[ReqT][Method]>,
  ErrorT = FetchResponseError<'get' extends Method ? Paths[ReqT]['get'] : Paths[ReqT][Method]>,
  DataT = ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = null,
>(
  path: ReqT | (() => ReqT),
  options?: Omit<UseFetchOptions<Method, ParamsOption<'get' extends Method ? Paths[ReqT]['get'] : Paths[ReqT][Method]>, ResT, DataT, PickKeys, DefaultT>, 'lazy'>,
  autoKey?: string
) => AsyncData<PickFrom<DataT, PickKeys> | DefaultT, ErrorT | null>

const getOptions = (arg: any): OpenFetchOptions => {
  const { $openFetch } = useNuxtApp()

  return (typeof arg === 'string' ? $openFetch[arg as OpenFetchClientName] : arg)
}

const combineInterceptors = (...args: ComputedFetchOptions<any, any>[]) => {
  return interceptors.reduce((acc, name) => ({
    ...acc,
    [name]: async (ctx: any) => {
      await Promise.all(args.map((options) => unref(options[name])?.(ctx)))
    }
  }), {} as OpenFetchOptions)
}

export function createOpenFetchClient <Paths>(options: OpenFetchOptions): OpenFetchClient<Paths>
export function createOpenFetchClient <Paths>(name: OpenFetchClientName): OpenFetchClient<Paths>
export function createOpenFetchClient <Paths>(arg: OpenFetchOptions | OpenFetchClientName): OpenFetchClient<Paths> {
  return (path, { params, query, ...options } = {}) => {
    const sharedOptions = getOptions(arg)

    return $fetch(fillPath(path, params), {
      ...sharedOptions,
      ...options,
      ...combineInterceptors(options, sharedOptions),
      query: query as Record<string, unknown>
    })
  }
}

export function createUseOpenFetchClient <Paths>(options: OpenFetchOptions): UseOpenFetchClient<Paths>
export function createUseOpenFetchClient <Paths>(name: OpenFetchClientName): UseOpenFetchClient<Paths>
export function createUseOpenFetchClient <Paths>(arg: OpenFetchOptions | OpenFetchClientName): UseOpenFetchClient<Paths> {
  return (path, { params, query, ...options } = {}, autoKey) => {
    const sharedOptions = getOptions(arg)

    return useFetch(() => fillPath(toValue(path), toValue(params)), {
      ...sharedOptions,
      key: autoKey,
      ...options,
      ...combineInterceptors(options, sharedOptions),
      query: computed(() => toValue(query))
    })
  }
}

export function createUseLazyOpenFetchClient <Paths>(options: OpenFetchOptions): UseLazyOpenFetchClient<Paths>
export function createUseLazyOpenFetchClient <Paths>(name: OpenFetchClientName): UseLazyOpenFetchClient<Paths>
export function createUseLazyOpenFetchClient <Paths>(arg: OpenFetchOptions | OpenFetchClientName): UseLazyOpenFetchClient<Paths> {
  return (path, { params, query, ...options } = {}, autoKey) => {
    const sharedOptions = getOptions(arg)

    return useLazyFetch(() => fillPath(toValue(path), toValue(params)), {
      ...sharedOptions,
      key: autoKey,
      ...options,
      ...combineInterceptors(options, sharedOptions),
      query: computed(() => toValue(query))
    })
  }
}
