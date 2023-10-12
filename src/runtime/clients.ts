import type { Ref } from 'vue'
import type { FetchOptions as _FetchOptions } from 'ofetch'
import type { ErrorResponse, SuccessResponse, FilterKeys, MediaType, ResponseObjectMap, OperationRequestBodyContent } from "openapi-typescript-helpers"
import type { KeysOf, AsyncData, PickFrom } from "#app/composables/asyncData"
import type { UseFetchOptions as _UseFetchOptions } from "#app/composables/fetch"
import type { OpenFetchClientName } from '#build/nuxt-open-fetch'
import { toValue, unref, useNuxtApp, useFetch, useLazyFetch } from '#imports'
import { fillPath } from './utils'

const interceptors = ['onRequest', 'onResponse', 'onRequestError', 'onResponseError'] as const

export interface OpenFetchOptions extends Omit<_FetchOptions, 'method'> { }

type FetchResponseData<T> = FilterKeys<SuccessResponse<ResponseObjectMap<T>>, MediaType>
type FetchResponseError<T> = FilterKeys<ErrorResponse<ResponseObjectMap<T>>, MediaType>
type ComputedOptions<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Function ? T[K] : T[K] extends Record<string, any> ? ComputedOptions<T[K]> | Ref<T[K]> | T[K] : Ref<T[K]> | T[K]
}

type MethodOption<M, P> = 'get' extends keyof P ? { method?: M } : { method: M }

type ComputedMethodOption<M, P> = 'get' extends keyof P ? ComputedOptions<{ method?: M }> : ComputedOptions<{ method: M }>

type ParamsOption<T> = T extends { parameters: any } ? T["parameters"] : { query?: Record<string, unknown> }

type RequestBodyOption<T> = OperationRequestBodyContent<T> extends never
  ? { body?: never }
  : undefined extends OperationRequestBodyContent<T>
  ? { body?: OperationRequestBodyContent<T> }
  : { body: OperationRequestBodyContent<T> };

type FetchOptions<
  Method,
  LowercasedMethod,
  Params,
  Operation = 'get' extends LowercasedMethod ? ('get' extends keyof Params ? Params['get'] : never) : LowercasedMethod extends keyof Params ? Params[LowercasedMethod] : never
> =
  MethodOption<Method, Params>
  & ParamsOption<Operation>
  & RequestBodyOption<Operation>
  & Omit<OpenFetchOptions, 'query' | 'body'>

type UseFetchOptions<
  Method,
  LowercasedMethod,
  Params,
  ResT,
  DataT = ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = null,
  Operation = 'get' extends LowercasedMethod ? ('get' extends keyof Params ? Params['get'] : never) : LowercasedMethod extends keyof Params ? Params[LowercasedMethod] : never
> =
  ComputedMethodOption<Method, Params>
  & ComputedOptions<ParamsOption<Operation>>
  & ComputedOptions<RequestBodyOption<Operation>>
  & Omit<_UseFetchOptions<ResT, DataT, PickKeys, DefaultT>, 'method' | 'query' | 'body'>

export type OpenFetchClient<Paths> = <
  ReqT extends Extract<keyof Paths, string>,
  Method extends Extract<keyof Paths[ReqT], string> | Uppercase<Extract<keyof Paths[ReqT], string>>,
  LowercasedMethod extends Lowercase<Method> extends keyof Paths[ReqT] ? Lowercase<Method> : never,
  DefaultMethod extends 'get' extends LowercasedMethod ? 'get' : LowercasedMethod,
  ResT = FetchResponseData<Paths[ReqT][DefaultMethod]>
>(
  url: ReqT,
  options?: FetchOptions<Method, LowercasedMethod, Paths[ReqT]>
) => Promise<ResT>

export type UseOpenFetchClient<Paths> = <
  ReqT extends Extract<keyof Paths, string>,
  Method extends Extract<keyof Paths[ReqT], string> | Uppercase<Extract<keyof Paths[ReqT], string>>,
  LowercasedMethod extends Lowercase<Method> extends keyof Paths[ReqT] ? Lowercase<Method> : never,
  DefaultMethod extends 'get' extends LowercasedMethod ? 'get' : LowercasedMethod,
  ResT = FetchResponseData<Paths[ReqT][DefaultMethod]>,
  ErrorT = FetchResponseError<Paths[ReqT][DefaultMethod]>,
  DataT = ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = null,
>(
  url: ReqT | (() => ReqT),
  options?: UseFetchOptions<Method, LowercasedMethod, Paths[ReqT], ResT, DataT, PickKeys, DefaultT>,
  autoKey?: string
) => AsyncData<PickFrom<DataT, PickKeys> | DefaultT, ErrorT | null>

export type UseLazyOpenFetchClient<Paths> = <
  ReqT extends Extract<keyof Paths, string>,
  Method extends Extract<keyof Paths[ReqT], string> | Uppercase<Extract<keyof Paths[ReqT], string>>,
  LowercasedMethod extends Lowercase<Method> extends keyof Paths[ReqT] ? Lowercase<Method> : never,
  DefaultMethod extends 'get' extends LowercasedMethod ? 'get' : LowercasedMethod,
  ResT = FetchResponseData<Paths[ReqT][DefaultMethod]>,
  ErrorT = FetchResponseError<Paths[ReqT][DefaultMethod]>,
  DataT = ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = null,
>(
  url: ReqT | (() => ReqT),
  options?: Omit<UseFetchOptions<Method, LowercasedMethod, Paths[ReqT], ResT, DataT, PickKeys, DefaultT>, 'lazy'>,
  autoKey?: string
) => AsyncData<PickFrom<DataT, PickKeys> | DefaultT, ErrorT | null>

const getOptions = (arg: any): OpenFetchOptions => {
  const { $openFetch } = useNuxtApp()

  return (typeof arg === 'string' ? $openFetch[arg as OpenFetchClientName] : arg)
}

const combineInterceptors = (...args: ComputedOptions<FetchOptions<any, any, any>>[]) => {
  return interceptors.reduce((acc, name) => ({
    ...acc,
    [name]: async (ctx: any) => {
      await Promise.all(args.map((options) => unref(options[name])?.(ctx)))
    }
  }), {} as OpenFetchOptions)
}

export function createOpenFetchClient<Paths>(options: OpenFetchOptions): OpenFetchClient<Paths>
export function createOpenFetchClient<Paths>(name: OpenFetchClientName): OpenFetchClient<Paths>
export function createOpenFetchClient<Paths>(arg: OpenFetchOptions | OpenFetchClientName): OpenFetchClient<Paths> {
  return (url, { path, ...options }: any = {}) => {
    const sharedOptions = getOptions(arg)

    return $fetch(fillPath(url, path), {
      ...sharedOptions,
      ...options,
      ...combineInterceptors(options, sharedOptions)
    })
  }
}

export function createUseOpenFetchClient<Paths>(options: OpenFetchOptions): UseOpenFetchClient<Paths>
export function createUseOpenFetchClient<Paths>(name: OpenFetchClientName): UseOpenFetchClient<Paths>
export function createUseOpenFetchClient<Paths>(arg: OpenFetchOptions | OpenFetchClientName): UseOpenFetchClient<Paths> {
  return (url, { path, ...options }: any = {}, autoKey) => {
    const sharedOptions = getOptions(arg)

    return useFetch(() => fillPath(toValue(url), toValue(path)), {
      ...sharedOptions,
      key: autoKey,
      ...options,
      ...combineInterceptors(options, sharedOptions)
    })
  }
}

export function createUseLazyOpenFetchClient<Paths>(options: OpenFetchOptions): UseLazyOpenFetchClient<Paths>
export function createUseLazyOpenFetchClient<Paths>(name: OpenFetchClientName): UseLazyOpenFetchClient<Paths>
export function createUseLazyOpenFetchClient<Paths>(arg: OpenFetchOptions | OpenFetchClientName): UseLazyOpenFetchClient<Paths> {
  return (url, { path, ...options }: any = {}, autoKey) => {
    const sharedOptions = getOptions(arg)

    return useLazyFetch(() => fillPath(toValue(url), toValue(path)), {
      ...sharedOptions,
      key: autoKey,
      ...options,
      ...combineInterceptors(options, sharedOptions)
    })
  }
}
