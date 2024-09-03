<script setup lang="ts">
  import '@/assets/layout.scss'

  import type { BoxProps } from '../Box/util'
  import type { ThemeProps } from '../ThemeProvider/types'

  import { provide, ref } from 'vue'

  import ThemeProvider from '../ThemeProvider/theme-provider.vue'
  import ScrollContainer from './scroll-container.vue'

  defineProps<ThemeProps & /** @vue-ignore */ BoxProps>()
  defineOptions({ name: 'MdLayout' })

  const contentScrollTop = ref(0)
  const headerTitle = ref('')

  provide('content-scroll-top', contentScrollTop)
  provide('header-title', headerTitle)
</script>

<template>
  <ThemeProvider class="md-layout" v-bind="$props">
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
