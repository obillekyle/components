<script setup lang="ts">
  import { onMounted, onUnmounted, provide, ref } from 'vue'

  interface ScrollPosition {
    x: number
    y: number
  }

  type ScrollContainerEmits = {
    (e: 'change', value: ScrollPosition): void
    (e: 'scroll', value: ScrollPosition): void
  }

  const emit = defineEmits<ScrollContainerEmits>()
  const root = ref<HTMLElement>()
  const model = defineModel<ScrollPosition>({
    default: () => ({ x: 0, y: 0 })
  })

  function onScroll(event: Event) {
    const target = event.currentTarget as HTMLElement

    const x = target.scrollLeft
    const y = target.scrollTop
    model.value = { x, y }
    emit('scroll', { x, y })
    emit('change', { x, y })
  }

  onMounted(() => root.value?.addEventListener('scroll', onScroll))
  onUnmounted(() => root.value?.removeEventListener('scroll', onScroll))

  provide('scroll-container', model)
  defineOptions({ name: 'MdScrollContainer' })
</script>

<template>
  <div class="md-scroll" ref="root">
    <slot name="header" />
    <slot
      name="wrapper"
      class="md-scroll-wrapper"
      :content="$slots.default"
    >
      <div class="md-scroll-wrapper">
        <slot />
      </div>
    </slot>
  </div>
</template>

<style lang="scss">
  .md-scroll {
    overflow: auto;
    position: relative;
    display: block;
    height: 100%;
    width: 100%;

    &-wrapper {
      width: 100%;
      padding: var(--md);
    }
  }
</style>
