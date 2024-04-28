import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    'ofetch',
    'pathe',
  ],
})
