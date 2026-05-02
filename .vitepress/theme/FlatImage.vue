<!--
  Sibling to SchemeImage.vue. Used for screenshots that aren't keyed on the
  active colour scheme — e.g. marketplace, which doesn't ship the multi-scheme
  palette yet. Resolves `/screenshots/<name>.png`.

  When marketplace adopts schemes, swap usages to <SchemeImage> and delete
  this component along with the no-suffix PNGs.
-->
<script setup>
import { withBase } from 'vitepress'

const props = defineProps({
  name: { type: String, required: true },
  alt: { type: String, default: '' },
})
</script>

<template>
  <img
    :src="withBase(`/screenshots/${name}.png`)"
    :alt="alt || name"
    class="flat-screenshot"
  />
</template>

<style scoped>
.flat-screenshot {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}
</style>
