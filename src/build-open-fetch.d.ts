declare module '#build/open-fetch' {
  export type OpenFetchClientName = string
}

declare module '#build/types/open-fetch-hooks' {
  type InferFirstParameter<T> = T extends (arg: infer U, ...args: any[]) => any ? U : never
  type InferMaybeArray<T> = T extends Array<infer U> ? U : T
  type FetchHooksContext<T extends keyof FetchHooks> = InferFirstParameter<NonNullable<InferMaybeArray<FetchHooks[T]>>>
  type HookResult = unknown // Adjust if needed

  export type GlobalFetchHooks = {
    [K in keyof Required<FetchHooks> as `openFetch:${K}`]: (ctx: FetchHooksContext<K>) => HookResult
  }

  export type ClientFetchHooks = {
    [K in keyof Required<FetchHooks> as `openFetch:${K}:${string}`]: (ctx: FetchHooksContext<K>) => HookResult
  }
}

declare module '#app' {
  interface RuntimeNuxtHooks extends GlobalFetchHooks, ClientFetchHooks {}
}
