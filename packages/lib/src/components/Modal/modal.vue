<script setup lang="ts">
  import type { UtilityFunction } from '@/utils/component-manager'
  import type { ModalProps } from './util'

  import { targetsSelf } from '@/utils/dom/events'
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
    @click="closeable && targetsSelf($event, utils.close)"
  >
    <div class="md-modal-wrapper">
      <HybridIcon class="md-modal-icon" :icon="icon" />
      <div class="md-modal-title" v-if="title || $slots.title">
        <slot name="title">
          <HybridComponent :as="title" />
          <Icon
            tabindex="0"
            v-if="closeable"
            @keypress="utils.close"
            class="md-modal-close"
            :inline="false"
            :width="24"
            icon="material-symbols:close"
          />
        </slot>
      </div>

      <div class="md-modal-content">
        <ScrollContainer p="0" tabindex="0">
          <slot>
            <HybridComponent :as="content" />
          </slot>
        </ScrollContainer>
      </div>

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
    overflow: hidden;
    place-items: center;
    background: #0008;

    &-wrapper {
      display: grid;
      gap: var(--sm);
      padding: var(--xl);
      background: var(--surface-container-high);
      border-radius: var(--xxl);
      min-width: min(300px, 100%);
      max-width: min(768px, 100%);
    }

    &-icon {
      display: grid;
      place-items: center;
      color: var(--secondary);
    }

    &-title {
      font-size: var(--component-xxs);
      text-align: center;
    }

    &-content {
      color: var(--on-surface-variant);
    }

    &-actions {
      display: flex;
    }

    &-actions &-primary-actions {
      display: flex;
      margin-left: auto;
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

      .md-modal-wrapper {
        scale: 0.9;
      }
    }
  }
</style>
