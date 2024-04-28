import { existsSync } from 'node:fs'
import type { Readable } from 'node:stream'
import type { FetchOptions } from 'ofetch'
import type { OpenAPI3, OpenAPITSOptions } from 'openapi-typescript'
import {
  addImportsSources,
  addPlugin,
  addServerImports,
  addServerPlugin,
  addTemplate,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import openapiTS, { astToString } from 'openapi-typescript'
import { camelCase, kebabCase, pascalCase } from 'scule'
import { defu } from 'defu'
import { join } from 'pathe'

type OpenAPI3Schema = string | URL | OpenAPI3 | Readable

export interface OpenFetchOptions extends Pick<FetchOptions, 'baseURL' | 'query' | 'headers'> { }

export interface OpenFetchClientOptions extends OpenFetchOptions {
  schema?: OpenAPI3Schema
}

export interface ModuleOptions {
  clients?: Record<string, OpenFetchClientOptions>
  openAPITS?: OpenAPITSOptions
  disableNuxtPlugin?: boolean
  disableNitroPlugin?: boolean
}

interface ResolvedSchema {
  name: string
  fetchName: {
    composable: string
    lazyComposable: string
  }
  schema: OpenAPI3Schema
  openAPITS?: OpenAPITSOptions
}

const moduleName = 'open-fetch'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: `nuxt-${moduleName}`,
    configKey: camelCase(moduleName),
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const schemas: ResolvedSchema[] = []
    const clients: Record<string, OpenFetchClientOptions> = defu(nuxt.options.runtimeConfig.openFetch as any, options.clients)

    nuxt.options.runtimeConfig.public.openFetch = Object.fromEntries(Object.entries(clients)
      .map(([key, { schema: _, ...options }]) => [key, options])) as any

    for (const layer of nuxt.options._layers) {
      const { srcDir, openFetch } = layer.config
      const schemasDir = resolve(srcDir, 'openapi')
      const layerClients = defu(
        Object.fromEntries(Object.entries(clients).filter(([key]) => openFetch?.clients?.[key])),
        openFetch?.clients,
      ) as Record<string, OpenFetchClientOptions>

      for (const [name, config] of Object.entries(layerClients)) {
        // Skip if schema already added by upper layer or if config is not defined
        if (schemas.some(item => item.name === name) || !config)
          continue

        let schema: OpenAPI3Schema | undefined = config.schema

        if (!config.schema) {
          const jsonPath = resolve(schemasDir, `${name}/openapi.json`)
          const yamlPath = resolve(schemasDir, `${name}/openapi.yaml`)

          schema = existsSync(jsonPath) ? jsonPath : existsSync(yamlPath) ? yamlPath : undefined
          schema = schema ? new URL(`file://${schema}`) : undefined
        }
        else if (typeof config.schema === 'string') {
          schema = isValidUrl(config.schema) ? config.schema : new URL(`file://${resolve(srcDir, config.schema)}`)
        }

        if (!schema)
          throw new Error(`Could not find OpenAPI schema for "${name}"`)

        schemas.push({
          name,
          fetchName: {
            composable: getClientName(name),
            lazyComposable: getClientName(name, true),
          },
          schema,
          openAPITS: options?.openAPITS,
        })
      }
    }

    nuxt.options.alias = {
      ...nuxt.options.alias,
      '#open-fetch-schemas': join(nuxt.options.buildDir, 'types', moduleName, 'schemas'),
    }

    nuxt.options.optimization = nuxt.options.optimization || {
      keyedComposables: [],
    }

    nuxt.options.optimization.keyedComposables = [
      ...nuxt.options.optimization.keyedComposables,
      ...schemas.flatMap(({ fetchName }) => [
        { name: fetchName.composable, argumentLength: 3 },
        { name: fetchName.lazyComposable, argumentLength: 3 },
      ]),
    ]

    schemas.forEach(({ name, schema, openAPITS }) => {
      addTemplate({
        filename: `types/${moduleName}/schemas/${kebabCase(name)}.ts`,
        getContents: async () => {
          const ast = await openapiTS(schema, openAPITS)
          return astToString(ast)
        },
        write: true,
      })
    })

    addImportsSources({
      from: resolve(nuxt.options.buildDir, `${moduleName}.ts`),
      imports: schemas.flatMap(({ fetchName }) => Object.values(fetchName)),
    })

    addImportsSources({
      from: resolve(`runtime/fetch`),
      imports: [
        'createOpenFetch',
        'openFetchRequestInterceptor',
        'OpenFetchClient',
        'OpenFetchOptions',
      ],
    })

    addImportsSources({
      from: resolve(`runtime/useFetch`),
      imports: [
        'createUseOpenFetch',
        'UseOpenFetchClient',
      ],
    })

    addServerImports([{
      name: 'createOpenFetch',
      from: resolve('runtime/fetch'),
    }])

    addServerImports([{
      name: 'OpenFetchClient',
      from: resolve('runtime/fetch'),
    }])

    addTemplate({
      filename: `${moduleName}.ts`,
      getContents() {
        return `
import { createUseOpenFetch } from '#imports'
${schemas.map(({ name }) => `
import type { paths as ${pascalCase(name)}Paths } from '#open-fetch-schemas/${kebabCase(name)}'
`.trimStart()).join('').trimEnd()}

${schemas.length ? `export type OpenFetchClientName = ${schemas.map(({ name }) => `'${name}'`).join(' | ')}` : ''}

${schemas.map(({ name, fetchName }) => `
/**
 * Fetch data from an OpenAPI endpoint with an SSR-friendly composable.
 * See {@link https://nuxt-open-fetch.vercel.app/composables/useclient}
 * @param string The OpenAPI path to fetch
 * @param opts extends useFetch, $fetch options and useAsyncData options
 */
export const ${fetchName.composable} = createUseOpenFetch<${pascalCase(name)}Paths>('${name}')
/**
 * Fetch data from an OpenAPI endpoint with an SSR-friendly composable.
 * See {@link https://nuxt-open-fetch.vercel.app/composables/uselazyclient}
 * @param string The OpenAPI path to fetch
 * @param opts extends useFetch, $fetch options and useAsyncData options
 */
export const ${fetchName.lazyComposable} = createUseOpenFetch<${pascalCase(name)}Paths>('${name}', true)
`.trimStart()).join('\n')}`.trimStart()
      },
      write: true,
    })

    // Nuxt types
    addTypeTemplate({
      filename: `types/${moduleName}/nuxt.d.ts`,
      getContents: () => `
import type { OpenFetchClient } from '#imports'
${schemas.map(({ name }) => `
import type { paths as ${pascalCase(name)}Paths } from '#open-fetch-schemas/${kebabCase(name)}'
`.trimStart()).join('').trimEnd()}

declare module '#app' {
  interface NuxtApp {
    ${schemas.map(({ name }) => `$${name}: OpenFetchClient<${pascalCase(name)}Paths>`.trimStart()).join('\n    ')}
  }
}
        
declare module 'vue' {
  interface ComponentCustomProperties {
    ${schemas.map(({ name }) => `$${name}: OpenFetchClient<${pascalCase(name)}Paths>`.trimStart()).join('\n    ')}
  }
}

export {}
`.trimStart(),
    })

    // Nitro types
    addTemplate({
      filename: `types/${moduleName}/nitro.d.ts`,
      getContents: () => `
import type { OpenFetchClient } from '#imports'
${schemas.map(({ name }) => `
import type { paths as ${pascalCase(name)}Paths } from '#open-fetch-schemas/${kebabCase(name)}'
`.trimStart()).join('').trimEnd()}

declare module 'nitropack' {
  interface NitroApp {
    ${schemas.map(({ name }) => `$${name}: OpenFetchClient<${pascalCase(name)}Paths>`.trimStart()).join('\n    ')}
  }
}

export {}
`.trimStart(),
    })

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.typescript?.tsConfig?.include?.push(`./types/${moduleName}/nitro.d.ts`)
    })

    if (!options.disableNuxtPlugin)
      addPlugin(resolve('./runtime/nuxt-plugin'))
    if (!options.disableNitroPlugin) {
      // https://github.com/nuxt/nuxt/issues/21497
      nuxt.options.build.transpile.push(resolve('./runtime/nitro-plugin'))
      addServerPlugin(resolve('./runtime/nitro-plugin'))
    }
  },
})

function getClientName(name: string, lazy = false) {
  return `use${lazy ? 'Lazy' : ''}${pascalCase(name)}`
}

function isValidUrl(url: string) {
  try {
    return Boolean(new URL(url))
  }
  catch (e) {
    return false
  }
}
