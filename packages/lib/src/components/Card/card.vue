<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import type { BoxProps } from '../Box/util'

  import { getCSSValue } from '@/utils'
  import { exclude } from '@/utils/object'
  import Box from '../Box/box.vue'
  import { getBoxProps } from '../Box/util'

  interface CardProps extends BoxProps, /* @vue-ignore */ HTMLAttributes {
    variant?: 'elevated' | 'filled' | 'outlined'
  }

  defineOptions({ name: 'MdCard' })
  const props = defineProps<CardProps>()
  const boxProps = getBoxProps(exclude(props, ['p']))
</script>

<template>
  <Box
    v-bind="boxProps"
    :class="`md-card ${variant ?? 'outlined'}`"
    :style="{ '--card-padding': getCSSValue(p, 'px', 'padding') }"
  >
    <slot />
  </Box>
</template>

<style lang="scss">
  .md-card {
    --card-padding: var(--md);

    all: unset;
    display: flex;
    font: inherit;
    color: inherit;
    position: relative;
    overflow: hidden;
    flex-direction: column;
    border-radius: var(--md);
    transition:
      background-color 0.2s,
      box-shadow 0.2s;

    &.elevated {
      box-shadow: var(--shadow-1);
      background: var(--surface-container-low);

      &:hover {
        box-shadow: var(--shadow-2);
      }

      .md-card-actions.separator {
        background: var(--surface-container);
      }
    }

    &.filled {
      background: var(--surface-container-high);

      &:hover {
        box-shadow: var(--shadow-1);
      }

      .md-card-actions.separator {
        background: var(--surface-container-highest);
      }
    }

    &.outlined {
      background: var(--surface);
      box-shadow: 0 0 0 1px var(--outline-variant);

      &:hover {
        box-shadow:
          0 0 0 1px var(--outline),
          var(--shadow-1);
      }

      .md-card-actions.separator {
        border-top: 1px solid var(--outline-variant);
      }
    }

    &.dragged {
      box-shadow: var(--shadow-3);
    }

    &-head,
    &-body,
    &-actions {
      padding: var(--card-padding);
    }

    &-title {
      font-weight: 400;
      font-size: var(--component-xs);
      margin-bottom: var(--xxs);
      margin-block: 0;
    }

    &-subhead {
      font-size: var(--font-lg);
      font-weight: 400;
      margin-block: 0;
    }

    &-body {
      p:first-child {
        margin-top: 0;
      }

      p:last-child {
        margin-bottom: 0;
      }
    }

    &-image {
      width: 100%;
      object-fit: cover;
    }

    &-actions {
      display: flex;
      align-items: center;

      &:last-child {
        margin-top: auto;
      }

      &-sub {
        display: flex;
        margin-right: auto;
        align-items: center;
      }
    }
  }
</style>
