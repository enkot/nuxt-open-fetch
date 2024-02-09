import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    let html = await $fetch('/')

    // Regular expression to match the unwanted HTML tags
    const regex = /<!DOCTYPE html><html><head>[\s\S]*?<\/head>/;

    // Replace the matched string with an empty string
    html = html.replace(regex, '');

    expect(html).toMatchInlineSnapshot(`
      "<body><div id=\\"__nuxt\\"><!--[--><button data-test=\\"client-button\\"> execute on client </button><pre data-test=\\"client-result\\">    clientData: {
        &quot;id&quot;: 1,
        &quot;category&quot;: {
          &quot;id&quot;: 0,
          &quot;name&quot;: &quot;otter&quot;
        },
        &quot;name&quot;: &quot;MyDog&quot;,
        &quot;photoUrls&quot;: [],
        &quot;tags&quot;: [
          {
            &quot;id&quot;: 0,
            &quot;name&quot;: &quot;otter&quot;
          }
        ],
        &quot;status&quot;: &quot;available&quot;
      }
        </pre><button data-test=\\"server-button\\"> fetch from server </button><pre data-test=\\"server-result\\">    serverData: {
        &quot;data&quot;: {
          &quot;id&quot;: 1,
          &quot;category&quot;: {
            &quot;id&quot;: 0,
            &quot;name&quot;: &quot;otter&quot;
          },
          &quot;name&quot;: &quot;MyDog&quot;,
          &quot;photoUrls&quot;: [],
          &quot;tags&quot;: [
            {
              &quot;id&quot;: 0,
              &quot;name&quot;: &quot;otter&quot;
            }
          ],
          &quot;status&quot;: &quot;available&quot;
        }
      } 
        </pre><!--]--></div><script type=\\"application/json\\" id=\\"__NUXT_DATA__\\" data-ssr=\\"true\\">[[\\"Reactive\\",1],{\\"data\\":2,\\"state\\":19,\\"once\\":20,\\"_errors\\":21,\\"serverRendered\\":23,\\"path\\":24},{\\"$siNM9WAguS\\":3,\\"b7WjfT8NJa\\":13},{\\"id\\":4,\\"category\\":5,\\"name\\":8,\\"photoUrls\\":9,\\"tags\\":10,\\"status\\":12},1,{\\"id\\":6,\\"name\\":7},0,\\"otter\\",\\"MyDog\\",[],[11],{\\"id\\":6,\\"name\\":7},\\"available\\",{\\"data\\":14},{\\"id\\":4,\\"category\\":15,\\"name\\":8,\\"photoUrls\\":16,\\"tags\\":17,\\"status\\":12},{\\"id\\":6,\\"name\\":7},[],[18],{\\"id\\":6,\\"name\\":7},{},[\\"Set\\"],{\\"$siNM9WAguS\\":22,\\"b7WjfT8NJa\\":22},null,true,\\"/\\"]</script>
      <script>window.__NUXT__={};window.__NUXT__.config={public:{openFetch:{pets:{baseURL:\\"https://petstore3.swagger.io/api/v3\\"}},openFetchServer:{pets:{baseURL:\\"https://petstore3.swagger.io/api/v3\\"}}},app:{baseURL:\\"/\\",buildAssetsDir:\\"/_nuxt/\\",cdnURL:\\"\\"}}</script></body></html>"
    `)
  })
})
