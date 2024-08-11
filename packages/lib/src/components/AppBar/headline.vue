<script setup lang="ts">
  import type { BoxProps } from '@/components/Box/util'
  import type { TextProps } from '@/components/Text/util'

  import Text from '@/components/Text/text.vue'
  import { inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  const header = inject('header-title', ref(''))
  const scrollTop = inject('content-scroll-top', ref(0))

  interface HeadlineProps extends TextProps, BoxProps {
    title: string
  }

  const props = defineProps<HeadlineProps>()
  const setTitle = (value?: string) => (header.value = value ?? props.title)

  onMounted(setTitle)
  watch(() => props.title, setTitle)
  onBeforeUnmount(() => setTitle(''))
  defineOptions({ name: 'MdHeaderContent' })
</script>

<template>
  <Text
    class="md-header-content-title"
    :class="{ 'on-top': scrollTop < 6 }"
    v-bind="$props"
    :as="as ?? 'h1'"
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
    margin-top: calc(var(--md) * -1);
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
