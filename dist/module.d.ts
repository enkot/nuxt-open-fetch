import * as _nuxt_schema from '@nuxt/schema';
import { Readable } from 'node:stream';
import { FetchOptions } from 'ofetch';
import { OpenAPITSOptions, OpenAPI3 } from 'openapi-typescript';

type OpenAPI3Schema = string | URL | OpenAPI3 | Readable;
interface OpenFetchOptions extends Omit<FetchOptions, 'method' | 'params'> {
}
interface SerializableOpenFetchOptions extends Omit<OpenFetchOptions, 'onRequest' | 'onRequestError' | 'onResponse' | 'onResponseError' | 'parseResponse' | 'body' | 'signal'> {
}
interface OpenFetchClientOptions {
    schema?: OpenAPI3Schema;
    fetchOptions?: SerializableOpenFetchOptions;
    functionSuffix?: string;
}
interface ModuleOptions {
    clients?: Record<string, OpenFetchClientOptions>;
    openAPITS?: OpenAPITSOptions;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

export { type ModuleOptions, type OpenFetchClientOptions, type OpenFetchOptions, type SerializableOpenFetchOptions, _default as default };
