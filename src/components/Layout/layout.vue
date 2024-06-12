<script setup lang="ts">
  import Color from 'color'
  import deep from 'deepmerge'
  import { getUnique } from '@/utils/number'
  import type { HTMLAttributes } from 'vue'
  import type { LayoutOptions } from './util'
  import type { PartialDeep } from 'type-fest'
  import ScrollContainer from './scroll-container.vue'
  import { DefaultLayoutOptions } from './util'
  import LayoutStyles from './layout-styles.vue'
  import { computed, onMounted, onUnmounted, provide, ref } from 'vue'
  import './style.scss'
  import { interval, removeInterval } from '@/utils'

  interface LayoutProps extends /** @vue-ignore */ HTMLAttributes {
    options?: PartialDeep<LayoutOptions>
  }
  const props = defineProps<LayoutProps>()
  const options = computed<LayoutOptions>(() => {
    const opts = props.options || {}
    const options = DefaultLayoutOptions

    const primary = opts.color?.primary || options.color.primary
    const secondary = opts.color?.secondary || Color(primary).rotate(180).hex()

    const propsOptions = deep(opts, { color: { primary, secondary } })
    return deep(options, propsOptions) as LayoutOptions
  })

  const rotate = ref(0)
  const rotaterKey = ref(0)
  const contentScrollTop = ref(0)
  const id = getUnique('layout')
  const headerTitle = ref('')

  defineOptions({
    name: 'MdLayout'
  })

  function rotater() {
    rotaterKey.value = interval(
      () => {
        rotate.value = (rotate.value + 0.5) % 360
      },
      { time: 1000 / 24 }
    )
  }

  provide('layout-id', id)
  provide('options', options)
  provide('content-scroll-top', contentScrollTop)
  provide('header-title', headerTitle)
  provide('md3', true)
  provide('rotate', rotate)

  onMounted(() => rotater())
  onUnmounted(() => removeInterval(rotaterKey.value))
</script>

<template>
  <div class="md-layout" :class="[options.theme]" :id="id">
    <LayoutStyles />
    <slot name="navbar" />
    <slot name="sidebar" />
    <slot name="header" />
    <div class="md-layout-content">
      <slot name="fab" />
      <ScrollContainer :scroll-change="({ y }) => (contentScrollTop = y)">
        <slot />
      </ScrollContainer>
    </div>
  </div>
</template>

<style lang="scss">
  .md-layout {
    --background-body: var(--primary-5, #111);
    --background-secondary: var(--primary-10, #333);

    &.light {
      --background-body: var(--primary-1, #fff);
    }

    position: absolute;
    color: var(--mono-80);
    background: var(--background-body);
    inset: 0;

    .md-layout-content {
      position: absolute;
      inset: 0;
    }

    &:has(.md-navbar) {
      .md-layout-content {
        left: var(--navbar-size);
      }

      .md-header {
        left: var(--navbar-size);
      }
    }

    &:has(.md-header) {
      .md-layout-content > .md-scroll > .md-scroll-wrapper {
        padding-top: var(--header-size);

        .md-master-switch {
          top: calc(var(--header-size) + var(--sm)) !important;
        }
      }
    }
  }
</style>
