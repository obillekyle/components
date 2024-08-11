<script setup lang="ts">
  import '@/assets/layout.scss'

  import type { ThemeProps } from './util'

  import { provide, ref } from 'vue'

  import ScrollContainer from './scroll-container.vue'
  import ThemeProvider from './theme-provider.vue'

  withDefaults(defineProps<ThemeProps>(), {
    md3: true
  })

  const contentScrollTop = ref(0)
  const headerTitle = ref('')

  defineOptions({
    name: 'MdLayout'
  })

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
