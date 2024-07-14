<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import type { LayoutOptions } from './util'
  import type { PartialDeep } from 'type-fest'

  import { adjustHue } from 'color2k'
  import deep from 'deepmerge'
  import ScrollContainer from './scroll-container.vue'
  import LayoutStyles from './layout-styles.vue'
  import { hashStr } from '@/utils/string'
  import { DefaultLayoutOptions } from './util'
  import { computed, onMounted, onUnmounted, provide, ref } from 'vue'
  import { interval, removeInterval } from '@/utils/performance'
  import './style.scss'

  interface LayoutProps extends /** @vue-ignore */ HTMLAttributes {
    globalStyle?: boolean
    useMd3?: boolean
    options?: PartialDeep<LayoutOptions>
  }
  const props = withDefaults(defineProps<LayoutProps>(), {
    useMd3: true
  })
  const options = computed<LayoutOptions>(() => {
    const opts = props.options || {}
    const options = DefaultLayoutOptions

    const primary = opts.colors?.primary || options.colors.primary
    const secondary =
      opts.colors?.secondary ||
      adjustHue(primary.toString?.() || '#000', 180)

    const propsOptions = deep(opts, { colors: { primary, secondary } })
    return deep(options, propsOptions) as LayoutOptions
  })

  const id = computed(() => {
    const obj = JSON.stringify({
      globalStyle: props.globalStyle,
      options: options.value
    })

    return 'layout-' + hashStr(obj, 6)
  })

  const rotate = ref(0)
  const rotaterKey = ref(0)
  const contentScrollTop = ref(0)
  const headerTitle = ref('')

  defineOptions({
    name: 'MdLayout'
  })

  function rotater() {
    rotaterKey.value = interval(
      () => (rotate.value = (rotate.value + 0.5) % 360),
      { time: 1000 / 24 }
    )
  }

  provide('layout-id', id)
  provide('options', options)
  provide('content-scroll-top', contentScrollTop)
  provide('header-title', headerTitle)
  provide('md3', props.useMd3 ?? true)
  provide('rotate', rotate)

  onMounted(() => rotater())
  onUnmounted(() => removeInterval(rotaterKey.value))
</script>

<template>
  <div class="md-layout" :class="[options.theme]" :id>
    <LayoutStyles>
      <slot name="navbar" />
      <slot name="sidebar" />
      <slot name="header" />
      <div class="md-layout-content">
        <slot name="fab" />
        <ScrollContainer
          as="main"
          :scroll-change="({ y }) => (contentScrollTop = y)"
        >
          <slot />
        </ScrollContainer>
      </div>
    </LayoutStyles>
  </div>
</template>
