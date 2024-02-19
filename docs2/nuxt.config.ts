import {
  createShikiHighlighter,
  runTwoSlash,
  renderCodeToHTML
} from 'shiki-twoslash'

export default defineNuxtConfig({
  // https://github.com/nuxt-themes/docus
  extends: '@nuxt-themes/docus',
  modules: [
    // https://github.com/nuxt-modules/plausible
    '@nuxtjs/plausible',
    // https://github.com/nuxt/devtools
    '@nuxt/devtools',
    '@nuxthq/studio'
  ],
  nitro: {
    preset: 'vercel-static'
  },
  content: {
    markdown: {
      async highlighter() {
        const highlighter = await createShikiHighlighter({
          // Complete themes: https://github.com/shikijs/shiki/tree/main/packages/shiki/themes
          theme: 'nord'
        })
        return (rawCode, lang) => {
          const twoslashResults = runTwoSlash(rawCode, lang)
          return renderCodeToHTML(
            twoslashResults.code,
            lang,
            ['twoslash'],
            {},
            highlighter,
            twoslashResults
          )
        }
      }
    }
  }
})
