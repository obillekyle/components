<script setup lang="ts">
  import type { UtilityFunction } from '@/utils/component-manager'
  import type { ModalProps } from './util'

  import { keyClick, targetsSelf } from '@/utils/dom/events'
  import { customRef } from '@/utils/ref/custom-ref'
  import { useFocusLock } from '@/utils/ref/use-focus-lock'
  import { Icon } from '@iconify/vue'
  import { computed, provide } from 'vue'
  import { MODAL } from './util'

  import Box from '../Box/box.vue'
  import Button from '../Button/button.vue'
  import ScrollContainer from '../Layout/scroll-container.vue'
  import HybridComponent from '../Misc/hybrid-component.vue'
  import HybridIcon from '../Misc/hybrid-icon.vue'

  interface ModalOptions extends ModalProps {
    utils?: UtilityFunction<ModalProps>
  }

  defineOptions({ name: 'MdModal' })
  const props = defineProps<ModalOptions>()
  const utils = computed(() => props.utils ?? MODAL.DEFAULT_UTILITY)

  const [root, setRef] = customRef<HTMLElement>()

  useFocusLock(root)

  provide('modal-utils', utils)
</script>

<template>
  <Box
    :ref="setRef"
    class="md-modal"
    :class="{ 'md-modal-fullscreen': fullScreen }"
    @click="closeable && targetsSelf($event, utils.close)"
  >
    <div class="md-modal-wrapper">
      <HybridIcon class="md-modal-icon" :icon="icon" />
      <div class="md-modal-title" v-if="title || $slots.title">
        <div
          tabindex="0"
          class="md-modal-close"
          @keypress="keyClick"
          @click="utils.close"
          v-if="closeable && fullScreen"
        >
          <Icon :inline="false" :width="24" icon="material-symbols:close" />
        </div>
        <slot name="title">
          <HybridComponent :as="title" />
        </slot>
      </div>

      <ScrollContainer class="md-modal-content" p="0" tabindex="0">
        <slot>
          <HybridComponent :as="content" />
        </slot>
      </ScrollContainer>

      <div class="md-modal-actions" v-if="actions || subAction">
        <HybridComponent :as="subAction" />

        <div
          class="md-modal-primary-actions"
          v-if="actions && actions.length > 0"
        >
          <Button
            v-for="(action, index) in actions"
            :key="index"
            :label="action.label"
            :variant="action.variant ?? 'text'"
            @click="action.onClick(utils)"
          />
        </div>
      </div>
    </div>
  </Box>
</template>

<style lang="scss">
  .md-modal {
    inset: 0;
    position: fixed;
    display: grid;
    z-index: 200;
    max-height: 100%;
    place-items: center;
    background: #0008;

    &-wrapper {
      display: grid;
      overflow: hidden;
      position: absolute;
      grid-template:
        'icon' auto
        'title' auto
        'content' 1fr
        'actions' auto;
      padding: var(--xl);
      background: var(--surface-container-high);
      border-radius: var(--xxl);
      min-width: min(300px, calc(100% - var(--xl)));
      max-width: min(500px, calc(100% - var(--xl)));
      max-height: calc(100% - var(--xl));
    }

    .md-input.outlined .md-input-content::after {
      background: var(--surface-container-high);
    }

    &-icon {
      display: grid;
      place-items: center;
      padding-bottom: var(--md);
      color: var(--secondary);
    }

    &-title {
      padding-bottom: var(--md);
      font-size: var(--component-xxs);
      text-align: center;
    }

    &-content {
      color: var(--on-surface-variant);
    }

    &-actions {
      padding-top: var(--xl);
      display: flex;
    }

    &-close {
      margin-right: var(--md);
      cursor: pointer;
      line-height: 0;
    }

    &-actions &-primary-actions {
      display: flex;
      margin-left: auto;
    }

    &-fullscreen &-wrapper {
      display: grid;
      grid-template-rows: var(--component-lg) 1fr;
      max-width: min(540px, 100%);
      padding: 0;
      border-radius: var(--xs);
    }

    &-fullscreen &-icon {
      display: none;
    }

    &-fullscreen &-title {
      font-size: var(--font-xxl);
      height: var(--component-lg);
      display: flex;
      text-align: center;
      align-items: center;
      padding-inline: var(--xl);
      padding-bottom: 0;

      &:has(.md-modal-close) {
        padding-left: var(--md);
      }
    }

    &-fullscreen &-content {
      padding-inline: var(--xl);
      padding-bottom: var(--xl);
    }

    &-fullscreen &-actions {
      position: absolute;
      align-items: center;
      padding-top: 0;
      height: var(--component-lg);
      right: var(--sm);
      top: 0;
    }

    @media (width <= 600px) {
      &-fullscreen &-wrapper {
        max-height: 100%;
        min-width: 100%;
        height: 100%;
        border-radius: 0;
        padding: 0;
      }
    }

    &-enter-active,
    &-leave-active {
      transition: opacity 0.3s var(--timing-standard);

      .md-modal-wrapper {
        transition: scale 0.3s var(--timing-standard);
      }
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
      pointer-events: none;

      .md-modal-wrapper {
        scale: 0.9;
      }
    }
  }
</style>
