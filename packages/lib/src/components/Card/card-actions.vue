<script setup lang="ts">
  import { type HTMLAttributes } from 'vue'
  import Flex from '../Box/Flex/flex-box.vue'
  import { getBoxProps, type BoxProps } from '../Box/util'

  interface CardActionsProps
    extends BoxProps,
      /* @vue-ignore */ HTMLAttributes {
    separator?: boolean
  }

  defineOptions({ name: 'MdCardImage' })
  const props = defineProps<CardActionsProps>()
  const boxProps = getBoxProps(props)
</script>

<template>
  <Flex v-bind="boxProps" class="md-card-actions" :class="{ separator }">
    <div class="md-card-actions-sub">
      <slot name="sub" />
    </div>
    <slot />
  </Flex>
</template>
