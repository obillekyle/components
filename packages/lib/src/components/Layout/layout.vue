<script setup lang="ts">
  import '@/assets/layout.scss'

  import type { HTMLAttributes } from 'vue'
  import type { ThemeProps } from './util'

  import { interval, removeInterval } from '@/utils/performance'
  import { hashStr } from '@/utils/string'
  import { computed, onMounted, onUnmounted, provide, ref } from 'vue'

  import ScrollContainer from './scroll-container.vue'
  import ThemeProvider from './theme-provider.vue'

  interface LayoutProps
    extends ThemeProps,
      /** @vue-ignore */ HTMLAttributes {}
  const props = withDefaults(defineProps<LayoutProps>(), {
    md3: true
  })

  const name = computed(() => {
    const object = JSON.stringify(props)
    return 'layout-' + hashStr(object, 6)
  })

  const rotate = ref(0)
  let intervalKey: number
  const contentScrollTop = ref(0)
  const headerTitle = ref('')

  defineOptions({
    name: 'MdLayout'
  })

  function rotater() {
    intervalKey = interval(
      () => (rotate.value = (rotate.value + 0.5) % 360),
      { time: 1000 / 24 }
    )
  }

  provide('layout-id', name)
  provide('content-scroll-top', contentScrollTop)
  provide('header-title', headerTitle)
  provide('rotate', rotate)

  onMounted(() => rotater())
  onUnmounted(() => removeInterval(intervalKey))
</script>

<template>
  <ThemeProvider class="md-layout" v-bind="$props" :name>
    <slot name="navbar" />
    <slot name="sidebar" />
    <slot name="header" />
    <div class="md-layout-content">
      <slot name="fab" />
      <ScrollContainer
        as="main"
        @change="({ y }) => (contentScrollTop = y)"
      >
        <slot />
      </ScrollContainer>
    </div>
  </ThemeProvider>
</template>
