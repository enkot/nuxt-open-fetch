import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    typecheck: {
      enabled: true,
      tsconfig: './test/tsconfig.json',
    },
  },
})
