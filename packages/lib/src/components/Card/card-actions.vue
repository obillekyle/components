<script setup lang="ts">
  import Flex from '../Box/Flex/flex-box.vue'
  import type { BoxProps } from '../Box/util'

  interface CardActionsProps extends /* @vue-ignore */ BoxProps {
    separator?: boolean
  }

  defineOptions({ name: 'MdCardImage' })
  defineProps<CardActionsProps>()
</script>

<template>
  <Flex class="md-card-actions" :class="{ separator }">
    <div class="md-card-actions-sub">
      <slot name="sub" />
    </div>
    <slot />
  </Flex>
</template>
