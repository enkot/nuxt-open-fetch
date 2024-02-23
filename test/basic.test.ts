import { describe, it, expect  } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).matchSnapshot()
  })

  it('loads data via client call', async () => {
    // Get response to a client-rendered page with `$fetch`.
    const html = await $fetch('/')
    html.document.querySelector('[data-test="client-button"]')?.click()
    await html.waitForSelector('[data-test="client-result"]')
    expect(html).matchSnapshot()
  })

  it('loads data via server call', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    html.document.querySelector('[data-test="server-button"]')?.click()
    await html.waitForSelector('[data-test="server-result"]')
    expect(html).matchSnapshot()
  })
})
