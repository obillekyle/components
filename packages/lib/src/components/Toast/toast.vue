<script setup lang="ts">
  import type { UtilityFunction } from '@/utils/component-manager'
  import type { ToastProps } from './util'

  import { ComponentManager } from '@/utils/component-manager'
  import { computed, onMounted, provide } from 'vue'
  import { TOAST, getFaviconUrl } from './util'

  import Box from '../Box/box.vue'
  import HybridComponent from '../Misc/hybrid-component.vue'
  import HybridIcon from '../Misc/hybrid-icon.vue'
  import Scroller from '../Text/scroller.vue'
  import Text from '../Text/text.vue'

  interface ToastOptions extends ToastProps {
    utils?: UtilityFunction<ToastProps>
  }

  defineOptions({ name: 'MdToast' })
  const props = defineProps<ToastOptions>()
  const utils = computed(
    () => props.utils ?? ComponentManager.DEFAULT_UTILITY
  )
  const icon = computed(() => props.icon ?? getFaviconUrl())
  onMounted(() =>
    setTimeout(() => utils.value.close(), TOAST.DEFAULT_TIMEOUT)
  )
  provide('toast-utils', utils)
</script>

<template>
  <Box
    class="md-toast"
    :class="{
      [variant ?? 'short']: true,
      static: Number.isNaN(utils.id)
    }"
  >
    <img
      v-if="typeof icon == 'string' && /[./]/.test(icon)"
      :src="icon"
      :alt="icon"
      width="24"
      height="24"
      class="md-toast-icon"
    />
    <HybridIcon v-else :icon="icon" class="md-toast-icon" :size="24" />

    <Scroller
      class="md-toast-content"
      v-if="variant === 'short'"
      as="span"
      continuous
    >
      <slot> <HybridComponent :as="message" /> </slot>
    </Scroller>
    <Text class="md-toast-content" v-else lines="3">
      <slot> <HybridComponent :as="message" /> </slot>
    </Text>
  </Box>
</template>

<style lang="scss">
  .md-toast {
    display: flex;
    align-items: center;
    height: var(--component-md);
    padding-inline: var(--md);
    border-radius: var(--xl);
    background: var(--surface-dim);
    box-shadow: var(--shadow-2);
    color: var(--on-surface);
    z-index: 999;
    left: 50%;
    translate: -50% 0;
    position: fixed;
    max-width: min(300px, calc(100% - var(--xl)));
    pointer-events: none;
    bottom: var(--component-xl);

    &.expanded {
      height: auto;
      min-height: var(--component-md);
      max-width: min(500px, calc(100% - var(--xl)));
    }

    &-icon {
      border-radius: var(--xl);
      overflow: hidden;
      flex-shrink: 0;
      z-index: 1;
    }

    &-content {
      width: max-content;
      padding-inline: var(--md) var(--xs);
    }

    &-enter-active,
    &-leave-active {
      transition:
        opacity 0.3s var(--timing-standard),
        scale 0.3s var(--timing-standard);
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
      pointer-events: none;
      scale: 0.9;
    }
  }
</style>
