import type { Ref } from 'vue'
import type { $Fetch, FetchContext, FetchError, FetchOptions } from 'ofetch'
import type {
  ErrorResponse,
  SuccessResponse,
  FilterKeys,
  MediaType,
  ResponseObjectMap,
  OperationRequestBodyContent,
} from "openapi-typescript-helpers"
import type { AsyncData, UseFetchOptions } from "nuxt/app"
import type { OpenFetchClientName } from '#build/nuxt-open-fetch'
import { toValue } from 'vue'
import { $fetch } from 'ofetch'
import { useNuxtApp, useFetch } from 'nuxt/app'
import { fillPath } from '../utils'

type PickFrom<T, K extends Array<string>> = T extends Array<any> ? T : T extends Record<string, any> ? keyof T extends K[number] ? T : K[number] extends never ? T : Pick<T, K[number]> : T;
type KeysOf<T> = Array<T extends T ? keyof T extends string ? keyof T : never : never>;

type FetchResponseData<T> = FilterKeys<SuccessResponse<ResponseObjectMap<T>>, MediaType>
type FetchResponseError<T> = FetchError<FilterKeys<ErrorResponse<ResponseObjectMap<T>>, MediaType>>
type ComputedOptions<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] : T[K] extends Record<string, unknown> ? ComputedOptions<T[K]> : Ref<T[K]> | T[K]
}

type MethodOption<M, P> = 'get' extends keyof P ? { method?: M } : { method: M }

type ComputedMethodOption<M, P> = 'get' extends keyof P ? ComputedOptions<{ method?: M }> : ComputedOptions<{ method: M }>

type ParamsOption<T> = T extends { parameters?: any, query?: any } ? T["parameters"] : never

type RequestBodyOption<T> = OperationRequestBodyContent<T> extends never
  ? { body?: never }
  : undefined extends OperationRequestBodyContent<T>
  ? { body?: OperationRequestBodyContent<T> }
  : { body: OperationRequestBodyContent<T> };

type OpenFetchOptions<
  Method,
  LowercasedMethod,
  Params,
  Operation = 'get' extends LowercasedMethod ? ('get' extends keyof Params ? Params['get'] : never) : LowercasedMethod extends keyof Params ? Params[LowercasedMethod] : never
> =
  MethodOption<Method, Params>
  & ParamsOption<Operation>
  & RequestBodyOption<Operation>
  & Omit<FetchOptions, 'query' | 'body' | 'method'>

type UseOpenFetchOptions<
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
  & Omit<UseFetchOptions<ResT, DataT, PickKeys, DefaultT>, 'query' | 'body' | 'method'>

export type OpenFetchClient<Paths> = <
  ReqT extends Extract<keyof Paths, string>,
  Method extends Extract<keyof Paths[ReqT], string> | Uppercase<Extract<keyof Paths[ReqT], string>>,
  LowercasedMethod extends Lowercase<Method> extends keyof Paths[ReqT] ? Lowercase<Method> : never,
  DefaultMethod extends 'get' extends LowercasedMethod ? 'get' : LowercasedMethod,
  ResT = FetchResponseData<Paths[ReqT][DefaultMethod]>
>(
  url: ReqT,
  options?: OpenFetchOptions<Method, LowercasedMethod, Paths[ReqT]>
) => Promise<ResT>

export type UseOpenFetchClient<Paths, Lazy> = <
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
  options?: Lazy extends true
    ? Omit<UseOpenFetchOptions<Method, LowercasedMethod, Paths[ReqT], ResT, DataT, PickKeys, DefaultT>, 'lazy'>
    : UseOpenFetchOptions<Method, LowercasedMethod, Paths[ReqT], ResT, DataT, PickKeys, DefaultT>,
  autoKey?: string
) => AsyncData<PickFrom<DataT, PickKeys> | DefaultT, ErrorT | null>

// More flexible way to rewrite the request path,
// but has problems - https://github.com/unjs/ofetch/issues/319
export const openFetchRequestInterceptor = (ctx: FetchContext) => {
  ctx.request = fillPath(ctx.request as string, (ctx.options as { path: Record<string, string> }).path)
}

export function createOpenFetch<Paths>(options: FetchOptions | ((options: FetchOptions) => FetchOptions)): OpenFetchClient<Paths> {
  return (url: string, opts: any) => $fetch(
    fillPath(url, opts.path),
    typeof options === 'function' ? options(opts) : {
      ...options,
      ...opts
    }
  )
}

export function createUseOpenFetch<
  Paths,
  Lazy = false,
>(client: $Fetch | OpenFetchClientName, lazy?: Lazy): UseOpenFetchClient<Paths, Lazy>
export function createUseOpenFetch<
  Paths,
  Lazy = true,
>(client: $Fetch | OpenFetchClientName, lazy?: Lazy): UseOpenFetchClient<Paths, Lazy>
export function createUseOpenFetch<
  Paths,
  Lazy extends boolean
>(client: $Fetch | OpenFetchClientName, lazy = false): UseOpenFetchClient<Paths, Lazy> {
  return (url: string | (() => string), options: any = {}, autoKey?: string) => {
    const nuxtApp = useNuxtApp()
    const $fetch = (typeof client === 'string' ? nuxtApp[`$${client}Fetch`] : client)
    const opts = { $fetch, key: autoKey, ...options }

    return useFetch(() => toValue(url), lazy ? { ...opts, lazy } : opts)
  }
}
