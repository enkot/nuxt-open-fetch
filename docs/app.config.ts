export default defineAppConfig({
  docus: {
    title: 'Nuxt Open Fetch',
    description: 'Generate zero-overhead, typed OpenAPI clients for Nuxt.',
    image: 'https://github.com/enkot/nuxt-open-fetch/raw/main/docs/public/cover.png',
    socials: {
      github: 'enkot/nuxt-open-fetch',
      nuxt: {
        label: 'Nuxt',
        icon: 'simple-icons:nuxtdotjs',
        href: 'https://nuxt.com'
      }
    },
    github: {
      dir: '.starters/default/content',
      branch: 'main',
      repo: 'docus',
      owner: 'nuxt-themes',
      edit: true
    },
    aside: {
      level: 0,
      collapsed: false,
      exclude: []
    },
    header: {
      logo: true,
    }
  }
})
