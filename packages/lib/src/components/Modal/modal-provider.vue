<script setup lang="ts">
  import type { ComponentManager } from '@/utils/component-manager'
  import type { ModalProps } from './util'

  import { provide, shallowRef } from 'vue'

  import { onMounted } from 'vue'
  import { ModalManager } from './modal-manager'

  import Modal from './modal.vue'

  const props = defineProps<{
    manager?: ComponentManager<ModalProps>
  }>()

  const manager = props.manager || ModalManager
  const data = shallowRef(manager.data)

  provide('snackbar-manager', manager)
  defineOptions({ name: 'MdSnackbarProvider', inheritAttrs: false })
  onMounted(() => manager.on('change', () => (data.value = manager.data)))
</script>

<template>
  <slot />
  <div class="md-modal-provider">
    <transition-group name="md-modal">
      <Modal
        :key="key"
        :id="'md-modal-' + key"
        :utils="manager.utility(key)"
        v-for="(modal, key) in data"
        v-bind="modal"
      />
    </transition-group>
  </div>
</template>
