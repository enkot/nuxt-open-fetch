import type { FetchContext, FetchError, FetchOptions } from 'ofetch'
import type {
  ErrorResponse,
  FilterKeys,
  MediaType,
  OperationRequestBodyContent,
  ResponseObjectMap,
  SuccessResponse,
} from 'openapi-typescript-helpers'

export type FetchResponseData<T> = FilterKeys<SuccessResponse<ResponseObjectMap<T>>, MediaType>
export type FetchResponseError<T> = FetchError<FilterKeys<ErrorResponse<ResponseObjectMap<T>>, MediaType>>

export type MethodOption<M, P> = 'get' extends keyof P ? { method?: M } : { method: M }

export type ParamsOption<T> = T extends { parameters?: any, query?: any } ? T['parameters'] : {}

export type RequestBodyOption<T> = OperationRequestBodyContent<T> extends never
  ? { body?: never }
  : undefined extends OperationRequestBodyContent<T>
    ? { body?: OperationRequestBodyContent<T> }
    : { body: OperationRequestBodyContent<T> }

type OpenFetchOptions<
  Method,
  LowercasedMethod,
  Params,
  Operation = 'get' extends LowercasedMethod ? ('get' extends keyof Params ? Params['get'] : never) : LowercasedMethod extends keyof Params ? Params[LowercasedMethod] : never,
> =
  MethodOption<Method, Params>
  & ParamsOption<Operation>
  & RequestBodyOption<Operation>
  & Omit<FetchOptions, 'query' | 'body' | 'method'>

export type OpenFetchClient<Paths> = <
  ReqT extends Extract<keyof Paths, string>,
  Method extends Extract<keyof Paths[ReqT], string> | Uppercase<Extract<keyof Paths[ReqT], string>>,
  LowercasedMethod extends Lowercase<Method> extends keyof Paths[ReqT] ? Lowercase<Method> : never,
  DefaultMethod extends 'get' extends LowercasedMethod ? 'get' : LowercasedMethod,
  ResT = FetchResponseData<Paths[ReqT][DefaultMethod]>,
>(
  url: ReqT,
  options?: OpenFetchOptions<Method, LowercasedMethod, Paths[ReqT]>
) => Promise<ResT>

// More flexible way to rewrite the request path,
// but has problems - https://github.com/unjs/ofetch/issues/319
export function openFetchRequestInterceptor(ctx: FetchContext) {
  ctx.request = fillPath(ctx.request as string, (ctx.options as { path: Record<string, string> }).path)
}

export function createOpenFetch<Paths>(options: FetchOptions | ((options: FetchOptions) => FetchOptions)): OpenFetchClient<Paths> {
  return (url: string, opts: any) => globalThis.$fetch(
    fillPath(url, opts.path),
    typeof options === 'function'
      ? options(opts)
      : {
          ...options,
          ...opts,
        },
  )
}

export function fillPath(path: string, params: object = {}) {
  for (const [k, v] of Object.entries(params)) path = path.replace(`{${k}}`, encodeURIComponent(String(v)))
  return path
}
