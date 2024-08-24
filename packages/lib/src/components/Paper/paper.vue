<script setup lang="ts">
  import type { BoxProps } from '../Box/util'

  import Box from '../Box/box.vue'

  interface PaperProps extends /* @vue-ignore */ BoxProps {
    variant?:
      | 'primary'
      | 'secondary'
      | 'tertiary'
      | 'error'
      | 'neutral'
      | 'outlined'
  }

  defineProps<PaperProps>()
  defineOptions({ name: 'MdPaper' })
</script>

<template>
  <Box class="md-paper" :class="`md-paper-${variant || 'neutral'}`">
    <slot />
  </Box>
</template>

<style lang="scss">
  .md-paper {
    border-radius: var(--sm);
    padding: var(--md);

    &-primary {
      background: var(--primary-container);
      color: var(--on-primary-container);
    }

    &-secondary {
      background: var(--secondary-container);
      color: var(--on-secondary-container);
    }

    &-tertiary {
      background: var(--tertiary-container);
      color: var(--on-tertiary-container);
    }

    &-error {
      background: var(--error-container);
      color: var(--on-error-container);
    }

    &-neutral {
      background: var(--surface-container);
      color: var(--on-surface);
    }

    &-outlined {
      background: var(--surface-container-low);
      color: var(--on-surface-variant);
      outline: 1px solid var(--outline-variant);
    }
  }
</style>
