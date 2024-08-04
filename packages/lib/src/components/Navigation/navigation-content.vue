<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import Box from '../Box/box.vue'
  import { getBoxProps, type BoxProps } from '../Box/util'

  interface NavigationContentProps
    extends BoxProps,
      /* @vue-ignore */ HTMLAttributes {}

  defineOptions({ name: 'MdNavigationContent' })
  const props = defineProps<NavigationContentProps>()
  const boxProps = getBoxProps(props)
</script>

<template>
  <Box v-bind="boxProps" class="md-navbar-content">
    <slot />
  </Box>
</template>

<style lang="scss">
  .md-navbar-content {
    align-self: center;
  }

  .md-navbar-item + .md-navbar-content {
    margin-top: auto;
    padding-block: var(--sm);
  }
</style>
