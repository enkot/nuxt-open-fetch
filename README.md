<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: my-module
- Description: My new Nuxt module
-->
[![Nuxt Open Fetch](./docs/public/cover.png)](https://nuxt-open-fetch.vercel.app/)

# Nuxt Open Fetch

[![npm version][npm-version-src]][npm-version-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Generate zero-overhead, 100% typed OpenAPI clients for Nuxt.

In other words - `$fetch` and `useFetch` on steroids. Uses awesome [openapi-typescript](https://github.com/drwpow/openapi-typescript) generator under the hood.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [📖 &nbsp;Read the documentation](https://nuxt-open-fetch.vercel.app/)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- 🍹 &nbsp;No manual typing of your API
- 🍋 &nbsp;Supports OpenAPI 3.0 and 3.1 (including advanced features like [discriminators](https://spec.openapis.org/oas/v3.1.0#discriminator-object))
- 🌲 &nbsp;Uses runtime-free types that outperform old-school codegen
- 📡 &nbsp;Load schemas from YAML or JSON, locally or remotely
- 🥞 &nbsp;Works with Nuxt [Layers](https://nuxt.com/docs/getting-started/layers)

## Quick Setup

1. Add `nuxt-open-fetch` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-open-fetch

# Using yarn
yarn add --dev nuxt-open-fetch

# Using npm
npm install --save-dev nuxt-open-fetch
```

2. Add `nuxt-open-fetch` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-open-fetch'
  ]
})
```

That's it! You can now use `nuxt-open-fetch` in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

## License

Made with 💚

Published under the [MIT License](./LICENCE).

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-open-fetch/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-open-fetch

[license-src]: https://img.shields.io/npm/l/nuxt-open-fetch.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-open-fetch

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
