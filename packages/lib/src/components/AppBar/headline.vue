<script setup lang="ts">
  import type { BoxProps } from '@/components/Box/util'
  import type { TextProps } from '@/components/Text/util'
  import type { HTMLAttributes, Ref } from 'vue'

  import Text from '@/components/Text/text.vue'
  import { inject, onBeforeUnmount, onMounted, watch } from 'vue'

  const header = inject<Ref<string>>('header-title')!
  const scrollTop = inject<Ref<number>>('content-scroll-top')!

  interface HeaderContentProperties
    extends TextProps,
      BoxProps,
      /* @vue-ignore */ HTMLAttributes {
    title: string
  }

  const properties = defineProps<HeaderContentProperties>()
  const setTitle = (value?: string) =>
    (header.value = value ?? properties.title)

  onMounted(setTitle)
  watch(() => properties.title, setTitle)
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
