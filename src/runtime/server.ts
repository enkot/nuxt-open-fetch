import type { FetchContext, FetchOptions } from 'ofetch'
import type { SuccessResponse, FilterKeys, MediaType, ResponseObjectMap, OperationRequestBodyContent } from "openapi-typescript-helpers"
import { $fetch } from 'ofetch'

type FetchResponseData<T> = FilterKeys<SuccessResponse<ResponseObjectMap<T>>, MediaType>

type MethodOption<M, P> = 'get' extends keyof P ? { method?: M } : { method: M }

type ParamsOption<T> = T extends { parameters: any } ? T["parameters"] : { query?: Record<string, unknown> }

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

// More flexible way to rewrite the request path,
// but has problems - https://github.com/unjs/ofetch/issues/319
export const openFetchRequestInterceptor = (ctx: FetchContext) => {
  ctx.request = fillPath(ctx.request as string, (ctx.options as { path: Record<string, string> }).path)
}

export function createOpenFetch(options: FetchOptions | ((options: FetchOptions | undefined) => FetchOptions)): (url: string, opts: any) => Promise<any> {
  return (url: string, opts: any): Promise<any> => {
    const params = typeof options === 'function' ? options(opts) : {
      ...options ?? {},
      ...opts
    }
    return $fetch(
      fillPath(addBaseURL(url, params.baseURL), opts.path), params)
  }
}

export function fillPath(path: string, params: object = {}) {
  for (const [k, v] of Object.entries(params)) path = path.replace(`{${k}}`, encodeURIComponent(String(v)))
  return path
}

export function addBaseURL(url: string, baseURL: string | undefined) {
  return `${(baseURL ?? '').replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}
