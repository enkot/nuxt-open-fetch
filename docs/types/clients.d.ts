import type { Ref } from 'vue'
import type { FetchError, FetchOptions } from 'ofetch'
import type { ErrorResponse, SuccessResponse, FilterKeys, MediaType, ResponseObjectMap, OperationRequestBodyContent } from 'openapi-typescript-helpers'
import type { KeysOf, AsyncData, PickFrom } from 'nuxt/dist/app/composables/asyncData'
import type { UseFetchOptions } from 'nuxt/dist/app/composables/fetch'

type OpenFetchClientName = 'pets'

type FetchResponseData<T> = FilterKeys<SuccessResponse<ResponseObjectMap<T>>, MediaType>
type FetchResponseError<T> = FetchError<FilterKeys<ErrorResponse<ResponseObjectMap<T>>, MediaType>>
type ComputedOptions<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Function ? T[K] : T[K] extends Record<string, any> ? ComputedOptions<T[K]> | Ref<T[K]> | T[K] : Ref<T[K]> | T[K]
}

type MethodOption<M, P> = 'get' extends keyof P ? { method?: M } : { method: M }

type ComputedMethodOption<M, P> = 'get' extends keyof P ? ComputedOptions<{ method?: M }> : ComputedOptions<{ method: M }>

type ParamsOption<T> = T extends { parameters: any } ? T['parameters'] : { query?: Record<string, unknown> }

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

