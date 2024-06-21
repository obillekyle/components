<script setup lang="ts">
  import { inject, onMounted, type Ref, onBeforeUnmount } from 'vue'

  const headerTitle = inject<Ref<string>>('header-title')!
  const scrollTop = inject<Ref<number>>('content-scroll-top')!
  const props = defineProps<{
    title: string
  }>()

  onMounted(() => {
    headerTitle.value = props.title
  })

  onBeforeUnmount(() => {
    headerTitle.value = ''
  })
</script>

<template>
  <h1 class="md-header-title" :class="{ 'on-top': scrollTop < 6 }">
    {{ props.title }}
  </h1>
</template>

<style lang="scss" scoped>
  .md-header-title {
    position: relative;
    font-size: var(--size-sm);
    font-weight: 500;
    opacity: 0;
    z-index: 200;
    transform: translateY(-20%);
    margin-top: calc(var(--padding-md) * -1);
    margin-bottom: var(--md);
    transition:
      opacity 0.2s var(--timing-standard),
      transform 0.2s var(--timing-standard);

    &.on-top {
      transform: translateY(0);
      opacity: 1;
    }

    &:not(:first-child) {
      opacity: 1;
      margin-top: 0;
    }
  }
</style>
