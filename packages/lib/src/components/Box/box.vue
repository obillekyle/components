<script setup lang="ts">
  import type { BoxComponentProps } from './util'
  import { processBoxProps } from './util'
  import { computed } from 'vue'

  defineOptions({ name: 'MdBox' })
  const props = defineProps<BoxComponentProps>()
  const style = computed(() => processBoxProps(props))
  const mdBox = computed(() => (props.exclude ? null : props.bg ?? ''))
</script>

<template>
  <component :md-box="mdBox" :is="as ?? 'div'" :style>
    <slot />
  </component>
</template>

<style lang="scss">
  [md-box] {
    color: var(--color);
    background: var(--bg);

    > * {
      --bg: unset;
      --color: unset;
    }

    &[md-box='primary'] {
      --bg: var(--primary);
      --color: var(--on-primary);
    }

    &[md-box='secondary'] {
      --bg: var(--secondary);
      --color: var(--on-secondary);
    }

    &[md-box='error'] {
      --bg: var(--error);
      --color: var(--on-error);
    }

    &[md-box='mono'] {
      --bg: var(--mono-10);
      --color: var(--mono-80);
    }

    &[md-box='on-bg'] {
      color: var(--bg);
      background: var(--color);
    }
  }
</style>
