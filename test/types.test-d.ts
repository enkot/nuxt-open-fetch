import type { Ref } from 'vue'
import { describe, expectTypeOf, it } from 'vitest'
import { createOpenFetch } from '../src/runtime/fetch'
import { createUseOpenFetch } from '../src/runtime/useFetch'
import type { paths } from '#build/types/open-fetch/schemas/pets'

interface ReturnData {
  id?: number
  name: string
  category?: {
    id?: number
    name?: string
  } | undefined
  photoUrls: string[]
  tags?: {
    id?: number
    name?: string
  }[]
  status?: 'available' | 'pending' | 'sold'
}

describe('$[client]', async () => {
  const $pets = createOpenFetch<paths>({})

  it('is function', () => {
    expectTypeOf($pets).toBeFunction()
  })

  it('supports "method" in lowercase and uppercase', () => () => {
    $pets('/pet/{petId}', {
      path: { petId: 1 },
      method: 'get',
    })

    $pets('/pet/{petId}', {
      path: { petId: 1 },
      method: 'GET',
    })
  })

  it('has correct body type', () => () => {
    $pets('/pet', {
      method: 'post',
      body: {
        name: 'doggie',
        photoUrls: [],
      },
    })
  })

  it('has correct return type', () => async () => {
    const data = await $pets('/pet/{petId}')
    expectTypeOf(data).toMatchTypeOf<ReturnData>()
  })
})

describe('use[Client]', async () => {
  const usePets = createUseOpenFetch<paths>('pets')

  it('is function', () => {
    expectTypeOf(usePets).toBeFunction()
  })

  it('supports "method" in lowercase and uppercase', () => () => {
    usePets('/pet/{petId}', {
      path: { petId: 1 },
      method: 'get',
    })
    usePets('/pet/{petId}', {
      path: { petId: 1 },
      method: 'GET',
    })
  })

  it('has correct "body" type', () => () => {
    usePets('/pet', {
      method: 'post',
      body: {
        name: 'doggie',
        photoUrls: [],
      },
      immediate: true,
    })
  })

  it('has correct return type', () => () => {
    const { data } = usePets('/pet/{petId}', {
      path: { petId: 1 },
      immediate: false,
    })

    expectTypeOf(data).toMatchTypeOf<Ref<ReturnData | null>>()
  })

  it('has correct "transform" input parameter type', () => () => {
    usePets('/pet/{petId}', {
      path: { petId: 1 },
      transform: input => ({
        foo: input.name,
      }),
      immediate: false,
    })
  })

  it('has correct response type using "transform"', () => () => {
    const { data } = usePets('/pet/{petId}', {
      method: 'get',
      path: { petId: 1 },
      transform: input => ({
        foo: input.name,
      }),
      immediate: false,
    })

    expectTypeOf(data).toMatchTypeOf<Ref<{
      foo: string
    } | null>>()
  })

  it('has correct reponse type using "default"', () => () => {
    const { data } = usePets('/pet/{petId}', {
      path: { petId: 1 },
      default: () => ({
        bar: 12,
      }),
      immediate: false,
    })

    expectTypeOf(data).toMatchTypeOf<Ref<ReturnData | {
      bar: number
    }>>()
  })

  it('has correct response type using "default" and "transform"', () => () => {
    const { data } = usePets('/pet/{petId}', {
      path: { petId: 1 },
      transform: input => ({
        foo: input.name,
      }),
      default: () => ({
        bar: 12,
      }),
      immediate: false,
    })

    expectTypeOf(data).toMatchTypeOf<Ref<{
      foo: string
    } | {
      bar: number
    }>>()
  })

  it('has correct response type using "pick"', () => () => {
    const { data } = usePets('/pet/{petId}', {
      path: { petId: 1 },
      pick: ['name'],
      immediate: false,
    })

    expectTypeOf(data).toMatchTypeOf<Ref<{
      name: string
    } | null>>()
  })
})
