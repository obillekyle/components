<script setup lang="ts">
  import '@/assets/layout.scss'

  import type { BoxProps } from '../Box/util'
  import type { ThemeProps } from '../ThemeProvider/types'

  import ThemeProvider from '../ThemeProvider/theme-provider.vue'
  import ScrollContainer from './scroll-container.vue'

  defineProps<ThemeProps & /** @vue-ignore */ BoxProps>()
  defineOptions({ name: 'MdLayout' })
</script>

<template>
  <ThemeProvider class="md-layout" v-bind="$props">
    <slot name="navbar" />
    <div class="md-layout-content">
      <slot name="fab" />
      <ScrollContainer>
        <template #header>
          <slot name="header" />
        </template>
        <slot />
      </ScrollContainer>
    </div>
  </ThemeProvider>
</template>
