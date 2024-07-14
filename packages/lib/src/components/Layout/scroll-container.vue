<script setup lang="ts">
  import { evaluate } from '@/utils/object'
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import type { BoxProps } from '@/components/Box/util'
  import { getBoxProps } from '@/components/Box/util'
  import Box from '@/components/Box/box.vue'

  interface ScrollContainerProps extends BoxProps {
    scrollable?: boolean
    scrollChange?: (value: { x: number; y: number }) => void
  }

  const props = withDefaults(defineProps<ScrollContainerProps>(), {
    scrollable: true
  })

  const boxProps = getBoxProps(props)
  const element = ref<HTMLElement | null>(null)
  const model = defineModel<{ x: number; y: number }>({
    default: { x: 0, y: 0 }
  })

  function onScroll() {
    if (element.value) {
      const x = element.value.scrollLeft
      const y = element.value.scrollTop
      model.value = { x, y }
      evaluate(props.scrollChange, model.value)
    }
  }

  watch(model, () => {
    if (element.value) {
      element.value.scrollTo(model.value.x, model.value.y)
    }
  })

  onMounted(() => {
    if (element.value) {
      element.value.addEventListener('scroll', onScroll)
    }
  })

  onBeforeUnmount(() => {
    if (element.value) {
      element.value.removeEventListener('scroll', onScroll)
    }
  })
</script>

<template>
  <div
    class="md-scroll"
    :class="{ scrollable: scrollable ?? true }"
    ref="element"
  >
    <Box v-bind="boxProps" class="md-scroll-wrapper">
      <slot />
    </Box>
  </div>
</template>

<style lang="scss" scoped>
  .md-scroll {
    overflow: auto;
    position: relative;
    display: block;
    height: 100%;
    width: 100%;

    &-wrapper {
      padding: var(--padding-md);
      width: 100%;
    }

    &:not(.scrollable) {
      overflow: hidden;
    }

    &:has(.md-master-switch:first-child, .md-master-switch:nth-child(2)) {
      .md-master-switch {
        box-shadow: 0 calc(var(--size-xs) * -1) 0 var(--xl)
          var(--background-body);
      }
    }
  }
</style>
