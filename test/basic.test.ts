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
      "<body><div id=\\"__nuxt\\"><!--[--><button data-test=\\"client-button\\"> usePetsFetch </button><pre data-test=\\"client-result\\">    clientData: {
        &quot;id&quot;: 1,
        &quot;name&quot;: &quot;hello&quot;,
        &quot;photoUrls&quot;: [
          &quot;ut do adipisicing&quot;
        ],
        &quot;tags&quot;: [
          {
            &quot;id&quot;: -51733822,
            &quot;name&quot;: &quot;anim ipsum elit&quot;
          }
        ]
      }
        </pre><button data-test=\\"proxy-button\\"> usePetsProxyFetch </button><pre data-test=\\"proxy-result\\">    clientData: {
        &quot;id&quot;: 1,
        &quot;name&quot;: &quot;hello&quot;,
        &quot;photoUrls&quot;: [
          &quot;ut do adipisicing&quot;
        ],
        &quot;tags&quot;: [
          {
            &quot;id&quot;: -51733822,
            &quot;name&quot;: &quot;anim ipsum elit&quot;
          }
        ]
      }
        </pre><button data-test=\\"server-button\\"> useFetch </button><pre data-test=\\"server-result\\">    serverData: {
        &quot;id&quot;: 1,
        &quot;name&quot;: &quot;hello&quot;,
        &quot;photoUrls&quot;: [
          &quot;ut do adipisicing&quot;
        ],
        &quot;tags&quot;: [
          {
            &quot;id&quot;: -51733822,
            &quot;name&quot;: &quot;anim ipsum elit&quot;
          }
        ]
      }
        </pre><button data-test=\\"server-route-button\\"> usePetsFetchServer </button><pre data-test=\\"server-route-result\\">    serverData:  Error: [GET] &quot;/api/pets/pet/1&quot;: &lt;no response&gt; Failed to parse URL from /api/pets/pet/1
        </pre><!--]--></div><script type=\\"application/json\\" id=\\"__NUXT_DATA__\\" data-ssr=\\"true\\">[[\\"Reactive\\",1],{\\"data\\":2,\\"state\\":20,\\"once\\":21,\\"_errors\\":22,\\"serverRendered\\":28,\\"path\\":29},{\\"$siNM9WAguS\\":3,\\"$yOWuy93Eps\\":12,\\"fWwoVQ3JFH\\":16},{\\"id\\":4,\\"name\\":5,\\"photoUrls\\":6,\\"tags\\":8},1,\\"hello\\",[7],\\"ut do adipisicing\\",[9],{\\"id\\":10,\\"name\\":11},-51733822,\\"anim ipsum elit\\",{\\"id\\":4,\\"name\\":5,\\"photoUrls\\":13,\\"tags\\":14},[7],[15],{\\"id\\":10,\\"name\\":11},{\\"id\\":4,\\"name\\":5,\\"photoUrls\\":17,\\"tags\\":18},[7],[19],{\\"id\\":10,\\"name\\":11},{},[\\"Set\\"],{\\"$siNM9WAguS\\":23,\\"$yOWuy93Eps\\":23,\\"fWwoVQ3JFH\\":23,\\"$U5N2cz5slv\\":24},null,[\\"NuxtError\\",25],{\\"message\\":26,\\"statusCode\\":27},\\"[GET] \\\\\\"/api/pets/pet/1\\\\\\": \\\\u003Cno response> Failed to parse URL from /api/pets/pet/1\\",500,true,\\"/\\"]</script>
      <script>window.__NUXT__={};window.__NUXT__.config={public:{openFetch:{pets:{baseURL:\\"https://petstore3.swagger.io/api/v3\\"},foo:{baseURL:\\"/petsProxy\\"},petsProxy:{baseURL:\\"https://petstore3.swagger.io/api/v3\\"},clients:{petsProxy:{baseURL:\\"/petsProxy\\"}}},openFetchServer:{pets:{baseURL:\\"https://petstore3.swagger.io/api/v3\\",apiRoutePrefix:\\"/api/pets\\"}}},app:{baseURL:\\"/\\",buildAssetsDir:\\"/_nuxt/\\",cdnURL:\\"\\"}}</script></body></html>"
    `)
  }, 30000)
})
