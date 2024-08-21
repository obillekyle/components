<script setup lang="ts">
  import type { UtilityFunction } from '@/utils/component-manager'
  import { MODAL, type ModalProps } from './util'

  import { computed, provide } from 'vue'

  import Box from '../Box/box.vue'
  import Button from '../Button/button.vue'
  import HybridComponent from '../Misc/hybrid-component.vue'
  import HybridIcon from '../Misc/hybrid-icon.vue'

  interface ModalOptions extends ModalProps {
    utils?: UtilityFunction<ModalProps>
  }

  defineOptions({ name: 'MdModal' })
  const props = defineProps<ModalOptions>()
  const utils = computed(() => props.utils ?? MODAL.DEFAULT_UTILITY)

  provide('modal-utils', utils)
</script>

<template>
  <Box class="md-modal">
    <div class="md-modal-wrapper">
      <HybridIcon class="md-modal-icon" :icon="icon" />
      <div class="md-modal-title" v-if="title || $slots.title">
        <slot name="title">{{ title }}</slot>
      </div>

      <div class="md-modal-content">
        <slot>{{ content }}</slot>
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
