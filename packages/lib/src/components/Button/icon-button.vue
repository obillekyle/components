<script setup lang="ts">
  import type { SizesString } from '@/utils/css/type'
  import type { ButtonHTMLAttributes, Component } from 'vue'

  import { getCSSValue } from '@/utils/css/sizes'

  import HybridIcon from '../Misc/hybrid-icon.vue'
  import Action from '../Misc/action.vue'

  interface IconButtonProperties
    extends /* @vue-ignore */ ButtonHTMLAttributes {
    size?: SizesString
    selected?: boolean
    icon: string | Component
    variant?: 'filled' | 'tonal' | 'outlined' | 'standard'
  }

  defineProps<IconButtonProperties>()
  defineOptions({ name: 'MdIconButton' })
</script>

<template>
  <Action
    class="md-icon-button"
    :selected="selected || undefined"
    :variant="variant"
  >
    <HybridIcon
      :icon
      :style="{ fontSize: getCSSValue(size ?? '#md', 'px', 'icon') }"
    />
  </Action>
</template>

<style lang="scss">
  .md-icon-button {
    &[variant='filled'] .md-action-indicator {
      background: var(--surface-container-highest);
      color: var(--primary);
    }

    &[variant='tonal'] .md-action-indicator {
      background: var(--surface-container-highest);
      color: var(--on-surface-variant);
    }

    &[variant='outlined'] .md-action-indicator {
      background: transparent;
      box-shadow: 0 0 0 1px var(--outline);
      color: var(--on-surface-variant);
    }

    &[variant='standard'] .md-action-indicator {
      background: transparent;
      color: var(--on-surface-variant);
    }

    &[variant='filled'][selected] .md-action-indicator {
      background: var(--primary);
      color: var(--on-primary);
    }

    &[variant='tonal'][selected] .md-action-indicator {
      background: var(--secondary-container);
      color: var(--on-secondary-container);
    }

    &[variant='outlined'][selected] .md-action-indicator {
      background: var(--inverse-surface);
      color: var(--inverse-on-surface);
      box-shadow: none;
    }

    &[variant='standard'][selected] .md-action-indicator {
      color: var(--primary);
    }
  }
</style>
