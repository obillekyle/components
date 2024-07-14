<script setup lang="ts">
  import type { Ref, HTMLAttributes } from 'vue'
  import type { BoxProps } from '@/components/Box/util'
  import type { TextProps } from '@/components/Text/util'

  import Text from '@/components/Text/text.vue'
  import { inject, watch, onMounted, onBeforeUnmount } from 'vue'

  const header = inject<Ref<string>>('header-title')!
  const scrollTop = inject<Ref<number>>('content-scroll-top')!

  interface HeaderContentProps
    extends TextProps,
      BoxProps,
      /* @vue-ignore */ HTMLAttributes {
    title: string
  }

  const props = defineProps<HeaderContentProps>()
  const setTitle = (val?: string) => (header.value = val ?? props.title)

  onMounted(setTitle)
  watch(() => props.title, setTitle)
  onBeforeUnmount(() => setTitle(''))
  defineOptions({ name: 'MdHeaderContent' })
</script>

<template>
  <Text
    as="h1"
    class="md-header-content-title"
    :class="{ 'on-top': scrollTop < 6 }"
    v-bind="$props"
  >
    {{ title }}
  </Text>
</template>

<style lang="scss">
  .md-header-content-title {
    position: relative;
    font-size: var(--size-sm);
    font-weight: 500;
    opacity: 0;
    z-index: 99;
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
