<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())

definePageMeta({
  colorMode: 'dark',
})

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
})

defineOgImage({
  url: '/cover.png',
  title: page.value.title,
  description: page.value.description,
})
</script>

<template>
  <div>
    <span class="gradient" />
    <ULandingHero v-if="page.hero" v-bind="page.hero">
      <template #title>
        <MDC :value="page.hero.title" />
      </template>

      <MDC :value="page.hero.code" tag="pre" class="prose prose-primary dark:prose-invert mx-auto" />
    </ULandingHero>

    <ULandingSection :title="page.features.title" :links="page.features.links">
      <UPageGrid>
        <ULandingCard v-for="(item, index) of page.features.items" :key="index" v-bind="item" />
      </UPageGrid>
    </ULandingSection>
  </div>
</template>

<style scoped>
.gradient {
  position: fixed;
  top: 25vh;
  width: 100%;
  height: 30vh;
  background: radial-gradient(50% 50% at 50% 50%, #00DC82 0%, rgba(0, 220, 130, 0) 100%);
  filter: blur(180px);
  opacity: 0.6;
  z-index: -1;
}
</style>
