<script setup lang="ts">
  import type { BoxProps } from '@/components/Box/util'

  import Box from '@/components/Box/box.vue'
  import { getBoxProps } from '@/components/Box/util'
  import { onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'

  interface ScrollPosition {
    x: number
    y: number
  }

  interface ScrollContainerProps extends BoxProps {
    scrollable?: boolean
  }

  type ScrollContainerEmits = {
    (e: 'change', value: ScrollPosition): void
    (e: 'scroll', value: ScrollPosition): void
  }

  const emit = defineEmits<ScrollContainerEmits>()
  const props = withDefaults(defineProps<ScrollContainerProps>(), {
    scrollable: true
  })

  const boxProps = getBoxProps(props, {
    p: '#md'
  })
  const element = ref<HTMLElement>()
  const model = defineModel<ScrollPosition>({
    default: { x: 0, y: 0 }
  })

  provide('scroll-container', model.value)

  function onScroll() {
    if (element.value) {
      const x = element.value.scrollLeft
      const y = element.value.scrollTop
      model.value = { x, y }
      emit('scroll', { x, y })
      emit('change', { x, y })
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
  <div class="md-scroll" :class="{ scrollable }" ref="element">
    <Box v-bind="boxProps" class="md-scroll-wrapper">
      <slot />
    </Box>
  </div>
</template>

<style lang="scss">
  .md-scroll {
    overflow: auto;
    position: relative;
    display: block;
    height: 100%;
    width: 100%;

    &:not(.scrollable) {
      overflow: hidden;
    }

    &-wrapper {
      width: 100%;

      > .md-scroll {
        width: calc(100% + (var(--md) * 2));
        margin-inline: calc(var(--md) * -1);

        &:first-child {
          margin-top: calc(var(--md) * -1);
        }

        &:last-child {
          margin-bottom: calc(var(--md) * -1);
        }
      }

      &:has(
          > .md-master-switch:first-child,
          > .md-master-switch:nth-child(2)
        ) {
        .md-master-switch {
          --value: calc((var(--header-size) + var(--sm)) * -1) var(--sm)
            var(--header-size) var(--surface);

          box-shadow:
            var(--shadow-2),
            200px var(--value),
            -200px var(--value);
        }
      }
    }
  }
</style>
