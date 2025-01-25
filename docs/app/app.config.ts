export default defineAppConfig({
  ui: {
    primary: 'green',
    gray: 'slate',
    footer: {
      bottom: {
        left: 'text-sm text-gray-500 dark:text-gray-400',
        wrapper: 'border-t border-gray-200 dark:border-gray-800',
      },
    },
  },
  seo: {
    siteName: 'Nuxt Open Fetch',
  },
  header: {
    logo: {
      alt: '',
      light: '',
      dark: '',
    },
    search: true,
    colorMode: true,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/enkot/nuxt-open-fetch',
      'target': '_blank',
      'aria-label': 'Nuxt Open Fetch',
    }],
  },
  footer: {
    credits: `Copyright © 2023 - ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-nuxtdotjs',
      'to': 'https://nuxt.com',
      'target': '_blank',
      'aria-label': 'Nuxt Website',
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/enkot/nuxt-open-fetch',
      'target': '_blank',
      'aria-label': 'Nuxt Open Fetch',
    }],
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Useful Links',
      links: [{
        icon: 'i-heroicons-star',
        label: 'Star on GitHub',
        to: 'https://github.com/enkot/nuxt-open-fetch',
        target: '_blank',
      }, {
        icon: 'i-simple-icons-typescript',
        label: 'OpenAPI TypeScript',
        to: 'https://openapi-ts.pages.dev/',
        target: '_blank',
      }, {
        icon: 'i-simple-icons-nuxtdotjs',
        label: 'Nuxt Website',
        to: 'https://nuxt.com',
        target: '_blank',
      }],
    },
  },
})
