import { existsSync } from 'node:fs'
import type { Readable } from 'node:stream'
import type { FetchOptions } from 'ofetch'
import type { OpenAPI3, OpenAPITSOptions } from "openapi-typescript"
import { defineNuxtModule, createResolver, addTypeTemplate, addTemplate, addImportsSources, addPlugin, addServerPlugin, addServerImports, addServerHandler } from '@nuxt/kit'
import openapiTS from "openapi-typescript"
import { pascalCase, kebabCase, upperFirst } from 'scule'
import { defu } from 'defu'
import { isValidUrl } from './runtime/utils'
import { Project, ScriptTarget } from "ts-morph";

type OpenAPI3Schema = string | URL | OpenAPI3 | Readable

export interface OpenFetchOptions extends Pick<FetchOptions, 'baseURL' | 'query' | 'headers'> { }

export interface OpenFetchClientOptions extends OpenFetchOptions {
  schema?: OpenAPI3Schema
}
export interface OpenFetchServerOptions extends OpenFetchOptions {
  schema?: OpenAPI3Schema,
  apiRoutePrefix: string,
}

export interface ModuleOptions {
  clients?: Record<string, OpenFetchClientOptions>
  servers?: Record<string, OpenFetchServerOptions>
  openAPITS?: OpenAPITSOptions
  disablePlugin?: boolean
}

interface ResolvedSchema {
  name: string
  fetchName: {
    composable: string,
    lazyComposable: string,
  },
  schema: OpenAPI3Schema
  openAPITS?: OpenAPITSOptions
}

interface ResolvedServerSchema {
  name: string
  fetchName: {
    composable: string,
    lazyComposable: string,
    server: string,
  },
  schema: OpenAPI3Schema
  openAPITS?: OpenAPITSOptions,
  schemaAST?: string,
  apiRoutePrefix: string,
}

const moduleName = 'nuxt-open-fetch'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: moduleName,
    configKey: 'openFetch',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const schemas: ResolvedSchema[] = []
    const clients: Record<string, OpenFetchClientOptions> = defu(nuxt.options.runtimeConfig.openFetch as any, options.clients)

    nuxt.options.runtimeConfig.public.openFetch = Object.fromEntries(Object.entries(clients)
      .map(([key, { schema: _, ...options }]) => [key, options])) as any

    for (const layer of nuxt.options._layers) {
      const { srcDir, openFetch } = layer.config as typeof layer.config & { openFetch?: ModuleOptions }
      const schemasDir = resolve(srcDir, 'openapi')
      const layerClients = defu(
        Object.fromEntries(Object.entries(clients).filter(([key]) => openFetch?.clients?.[key])),
        openFetch?.clients,
      ) as Record<string, OpenFetchClientOptions>

      for (const [name, config] of Object.entries(layerClients)) {
        // Skip if schema already added by upper layer or if config is not defined
        if (schemas.some(item => item.name === name) || !config) continue

        let schema: OpenAPI3Schema | undefined = undefined

        if (config.schema && typeof config.schema === 'string') {
          schema = isValidUrl(config.schema) ? config.schema : resolve(srcDir, config.schema)
        } else {
          const jsonPath = resolve(schemasDir, `${name}/openapi.json`)
          const yamlPath = resolve(schemasDir, `${name}/openapi.yaml`)

          schema = existsSync(jsonPath) ? jsonPath : existsSync(yamlPath) ? yamlPath : undefined
        }

        if (!schema) throw new Error(`Could not find client-side OpenAPI schema for "${name}"`)

        schemas.push({
          name,
          fetchName: {
            composable: getClientName(name),
            lazyComposable: getClientName(name, true)
          },
          schema,
          openAPITS: options?.openAPITS,
        })
      }
    }

    nuxt.options.optimization = nuxt.options.optimization || {
      keyedComposables: []
    }

    nuxt.options.optimization.keyedComposables = [
      ...nuxt.options.optimization.keyedComposables,
      ...schemas.flatMap(({ fetchName }) => [
        { name: fetchName.composable, argumentLength: 3 },
        { name: fetchName.lazyComposable, argumentLength: 3 }
      ])
    ]

    const generatedSchemas = schemas.map(({ name, fetchName, schema, openAPITS }) => {
      const { filename } = addTypeTemplate({
        filename: `types/${moduleName}/${kebabCase(name)}.d.ts`,
        getContents: () => openapiTS(schema, openAPITS)
      })

      return {
        name,
        filename,
        fetchName
      }
    })

    addImportsSources({
      from: resolve(nuxt.options.buildDir, `${moduleName}/clients.ts`),
      imports: schemas.flatMap(({ fetchName }) => Object.values(fetchName)),
    })

    addImportsSources({
      from: resolve(`runtime/clients`),
      imports: [
        'createOpenFetch',
        'createUseOpenFetch',
        'openFetchRequestInterceptor',
        'OpenFetchClient',
        'OpenFetchOptions',
        'UseOpenFetchClient',
        'fillPath',
      ]
    })

    addTemplate({
      filename: `${moduleName}/clients.ts`,
      getContents() {
        return `
import { createUseOpenFetch } from '#imports'
${generatedSchemas.map(({ name, filename }) => `
import type { paths as ${pascalCase(name)}Paths } from '#build/${filename}'
`.trimStart()).join('').trimEnd()}

${generatedSchemas.length ? `export type OpenFetchClientName = ${schemas.map(({ name }) => `'${name}'`).join(' | ')}` : ''}

${generatedSchemas.map(({ name, fetchName }) => `
/**
 * Fetch data from an OpenAPI endpoint with an SSR-friendly composable.
 * See {@link https://nuxt-open-fetch.vercel.app/composables/useclientfetch}
 * @param string The OpenAPI path to fetch
 * @param opts extends useFetch, $fetch options and useAsyncData options
 */
export const ${fetchName.composable} = createUseOpenFetch<${pascalCase(name)}Paths>('${name}')
/**
 * Fetch data from an OpenAPI endpoint with an SSR-friendly composable.
 * See {@link https://nuxt-open-fetch.vercel.app/composables/uselazyclientfetch}
 * @param string The OpenAPI path to fetch
 * @param opts extends useFetch, $fetch options and useAsyncData options
 */
export const ${fetchName.lazyComposable} = createUseOpenFetch<${pascalCase(name)}Paths>('${name}', true)
`.trimStart()).join('\n')}`.trimStart()
      },
      write: true
    })

    addTypeTemplate({
      filename: `types/${moduleName}/clients.d.ts`,
      getContents: () => `
import type { OpenFetchClient } from '#imports'
${generatedSchemas.map(({ name, filename }) => `
import type { paths as ${pascalCase(name)}Paths } from '#build/${filename}'
`.trimStart()).join('').trimEnd()}

declare module '#app' {
  interface NuxtApp {
    ${generatedSchemas.map(({ name }) => `$${name}Fetch: OpenFetchClient<${pascalCase(name)}Paths>`.trimStart()).join('\n    ')}
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    ${generatedSchemas.map(({ name }) => `$${name}Fetch: OpenFetchClient<${pascalCase(name)}Paths>`.trimStart()).join('\n    ')}
  }
}

export {}
`.trimStart()
    })

    if (!options.disablePlugin) addPlugin(resolve('./runtime/nuxt-plugin'))

    /**
     * Add (nitro) server support
     */

    const serverSchemas: ResolvedServerSchema[] = []
    const servers: Record<string, OpenFetchServerOptions> = defu(nuxt.options.runtimeConfig.openFetchServer as any, options.servers)

    // TODO: Fix 'as any' type cast
    nuxt.options.runtimeConfig.public.openFetchServer = Object.fromEntries(Object.entries(servers)
      .map(([key, { schema: _, ...options }]) => [key, { ...options, apiRoutePrefix: getServerAPIRoutePrefix(key) }])) as any

    for (const layer of nuxt.options._layers) {
      const { srcDir, openFetch } = layer.config = layer.config as typeof layer.config & { openFetch?: ModuleOptions }
      const schemasDir = resolve(srcDir, 'openapi')
      const layerServers = defu(
        Object.fromEntries(Object.entries(servers).filter(([key]) => openFetch?.servers?.[key])),
        openFetch?.servers,
      ) as Record<string, OpenFetchClientOptions>

      for (const [name, config] of Object.entries(layerServers)) {
        // Skip if schema already added by upper layer or if config is not defined
        if (serverSchemas.some(item => item.name === name) || !config) continue

        let schema: OpenAPI3Schema | undefined = undefined

        if (config.schema && typeof config.schema === 'string') {
          schema = isValidUrl(config.schema) ? config.schema : resolve(srcDir, config.schema)
        } else {
          const jsonPath = resolve(schemasDir, `${name}/openapi.json`)
          const yamlPath = resolve(schemasDir, `${name}/openapi.yaml`)

          schema = existsSync(jsonPath) ? jsonPath : existsSync(yamlPath) ? yamlPath : undefined
        }

        if (!schema) throw new Error(`Could not find server-side OpenAPI schema for "${name}"`)

        serverSchemas.push({
          name,
          fetchName: {
            composable: getClientForServerName(name),
            lazyComposable: getClientForServerName(name, true),
            server: getServerName(name),
          },
          apiRoutePrefix: getServerAPIRoutePrefix(name),
          schema,
          openAPITS: options?.openAPITS,
        })
      }
    }

    nuxt.options.optimization.keyedComposables = [
      ...nuxt.options.optimization.keyedComposables,
      ...serverSchemas.flatMap(({ fetchName }) => [
        { name: fetchName.composable, argumentLength: 3 },
        { name: fetchName.lazyComposable, argumentLength: 3 }
      ])
    ]

    for (const { name, schema, openAPITS } of serverSchemas) {
      addTypeTemplate({
        filename: `types/${moduleName}/${kebabCase(name)}.server.d.ts`,
        getContents: () => openapiTS(schema, openAPITS)
      })
    }

    addImportsSources({
      from: resolve(`runtime/server`),
      imports: [
        'openFetchRequestInterceptorServer',
        'createOpenFetchServer',
        'createOpenFetchServerClient',
        'createUseOpenFetchServer',
        'addBaseURL',
      ]
    })

    addTemplate({
      filename: `${moduleName}/server/client.ts`,
      getContents() {
        return `
/**
 *  Auto generated by nuxt-open-fetch plugin
 */

import { createUseOpenFetchServer } from '#imports'
${serverSchemas.map(({ name }) => `
import type { paths as ${pascalCase(name)}Paths } from '#build/types/${moduleName}/${kebabCase(name)}'
`.trimStart()).join('').trimEnd()}

${serverSchemas.length ? `export type getClientForServerName = ${serverSchemas.map(({ name }) => `'${name}'`).join(' | ')}` : ''}

${serverSchemas.map(({ name, fetchName }) => `
export const ${fetchName.composable} = createUseOpenFetchServer<${pascalCase(name)}Paths>('${name}')
export const ${fetchName.lazyComposable} = createUseOpenFetchServer<${pascalCase(name)}Paths>('${name}', true)
`.trimStart()).join('\n')}`.trimStart()
      },
      write: true
    })


    addImportsSources({
      from: resolve(nuxt.options.buildDir, `${moduleName}/server/client.ts`),
      imports: serverSchemas.flatMap(({ fetchName }) => Object.values(fetchName)),
    })

    addTypeTemplate({
      filename: `types/${moduleName}/server.d.ts`,
      getContents: () => `
/**
 *  Auto generated by nuxt-open-fetch plugin
 */

import type { OpenFetchClient } from '#imports'
${serverSchemas.map(({ name }) => `
import type { paths as ${pascalCase(name)}Paths } from '#build/types/${moduleName}/${kebabCase(name)}'
`.trimStart()).join('').trimEnd()}

declare module '#app' {
  interface NuxtApp {
    ${serverSchemas.map(({ name }) => `
    $${name}FetchServer: OpenFetchClient<${pascalCase(name)}Paths>`.trimStart()).join('\n')}
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    ${serverSchemas.map(({ name }) => `
    $${name}FetchServer: OpenFetchClient<${pascalCase(name)}Paths>`.trimStart()).join('\n')}
  }
}

export {}
`.trimStart()
    })

    const clientImports = [
      'OpenFetchClient',
      'fillPath',
    ]
    clientImports.forEach((name) => {
      addServerImports([{
        name,
        from: resolve('runtime/clients'),
      }])
    })

    const serverImports = [
      'createOpenFetchServer',
      'createOpenFetchServerClient',
      'createUseOpenFetchServer',
    ]
    serverImports.forEach((name) => {
      addServerImports([{
        name,
        from: resolve('runtime/server'),
      }])
    })

    const utilsImports = [
      'fillPath',
    ]
    utilsImports.forEach((name) => {
      addServerImports([{
        name,
        from: resolve('runtime/utils'),
      }])
    })

    for (const { name, schema, openAPITS } of serverSchemas) {
      const serverSchema = serverSchemas.find((v) => v.name === name)
      if (serverSchema) {
        serverSchema.schemaAST = await openapiTS(schema, openAPITS)
      }
    }

    // Collect all of the schema's ASts
    const schemaASTs = serverSchemas.filter(serverSchema => {
      const hasSchemaAST = serverSchema.schemaAST !== undefined
      if (!hasSchemaAST) {
        console.warn(`No schema AST for ${serverSchema.name} present.\nRemoving the server schema from automatic API route conversion!`)
      }
      return hasSchemaAST
    }).map((v) => [v.name, v.schemaAST!!, v.apiRoutePrefix])

    // Construct the API routes and server route handlers
    for (const [name, ast, apiRoutePrefix] of schemaASTs) {
      const project = new Project({
        compilerOptions: {
          target: ScriptTarget.ESNext,
        },
      });

      const tsSourceFile = project.createSourceFile(resolve(`runtime/server/types/${moduleName}/${kebabCase(name)}.d.ts`), ast)

      const tsPathInterface = tsSourceFile.getInterfaceOrThrow('paths');
      const tsPathInterfaceProperties = tsPathInterface.getProperties()

      tsPathInterfaceProperties.forEach((prop) => {
        const fetchRouteName = prop.getSymbolOrThrow().getName()
        const handlerFilePath = fetchRouteName.replaceAll(/{(?<parameter>.*)}/g, "$<parameter>")

        // Create server handler source file
        const serverHandler = addTemplate({
          filename: `${moduleName}/server/routes/${handlerFilePath}.ts`,
          getContents() {
            return `
/**
 *  Auto generated server handler for route ${fetchRouteName}
 */

export default defineEventHandler(async (event) => {
  const fetchFunc = useNuxtOpenFetchServer()['$fetchPets']

  const params = getRouterParams(event)
  const {apiRoutePrefix, ...query} = getQuery(event)
  /**
   * Can't be inlined due to async behaviour
   * THe body ios only allowed on put and post methods, so it will
   * be stripped otherwise
   */
  const body = ['put', 'post'].includes(event.method.toLowerCase()) ? await readBody(event) : undefined

  const route = '${fetchRouteName}'
  const data = await fetchFunc(route, {
    query,
    path: {
      ...params,
    },
    // Only add the body if it is existing.
    ...(body ? { body } : {})
  });

  return data;
})
`.trimStart()
          },
          write: true
        })

        // addServerImports([{
        //   name: name,
        //   from: serverHandler.dst,
        // }])


        // Convert hte route from 'some/route/with/{pathParameter}' to 'some/route/with/:pathParameter'
        const route = fetchRouteName.replaceAll(/{(?<parameter>.*)}/g, ":$<parameter>")
        const methods = prop.getType().getSymbolOrThrow().getMembers().map(m => m.getName())
        methods.forEach((method) =>
          addServerHandler({
            route: `${apiRoutePrefix}${route}`,
            method,
            handler: serverHandler.dst,
          })
        )
      })
    }

    const serverSourceTemplate = addTemplate({
      filename: `${moduleName}/server.ts`,
      getContents() {
        return `
/**
 *  Auto generated by nuxt-open-fetch plugin
 */
import type { OpenFetchClient } from '#imports'
${serverSchemas.map(({ name }) => `
import type { paths as ${pascalCase(name)}Paths } from '#build/types/${moduleName}/${kebabCase(name)}.server'
`.trimStart()).join('').trimEnd()}

interface INuxtOpenFetchServer {
  ${serverSchemas.map(({ name, fetchName }) => `
  $fetch${fetchName.server}: OpenFetchClient<${pascalCase(name)}Paths>`.trimStart()).join('\n')}
}

export const nuxtOpenFetchServer: INuxtOpenFetchServer = {} as INuxtOpenFetchServer

// Can replaced by composables for Nitro server once it is stable
export const useNuxtOpenFetchServer = () => nuxtOpenFetchServer

`.trimStart()
      },
      write: true
    })

    const serverSourceTemplateImports = [
      'nuxtOpenFetchServer',
      'useNuxtOpenFetchServer',
    ]
    serverSourceTemplateImports.forEach((name) => {
      addServerImports([{
        name: name,
        from: serverSourceTemplate.dst,
      }])
    })

    // Transpile need to solve error '#imports' not allowed in server runtime
    nuxt.options.build.transpile.push(resolve('./runtime/nitro-plugin'))
    if (!options.disablePlugin) addServerPlugin(resolve('./runtime/nitro-plugin'))
  }
})

function getClientName(name: string, lazy = false) {
  return `use${lazy ? 'Lazy' : ''}${pascalCase(`${name}-fetch`)}`
}


function getClientForServerName(name: string, lazy = false) {
  return `use${lazy ? 'Lazy' : ''}${pascalCase(`${name}-fetch`)}Server`
}

export function getServerName(name: string) {
  return `${upperFirst(name)}`
}

export function getServerAPIRoutePrefix(name: string) {
  return `/api/${name}`
}
