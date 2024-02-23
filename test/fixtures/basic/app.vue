<template>
  <div>basic</div>
  <pre>{{ data }}</pre>
</template>

<script setup>
const { data } = usePetsFetch('/store/inventory')
</script>
