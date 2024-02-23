import type { FetchOptions } from "ofetch"

export const manualNuxtOpenFetch: { [name: string]: (url: string, opts: any) => Promise<any> } = {}

export const useManualNuxtOpenFetch = () => manualNuxtOpenFetch