<script setup lang="ts">
  import { useModal } from '@/components/Modal/modal-manager'
  import { MODAL } from '@/components/Modal/util'
  import { useSnackbar } from '@/components/Snackbar/snackbar-manager'

  import Button from '@/components/Button/button.vue'
  import Mock from './mock-content.vue'

  const snackbar = useSnackbar()
  const modal = useModal()

  function openSnackbar() {
    snackbar.open({
      message:
        'Hello World! Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, reprehenderit et. Impedit aperiam neque laborum aliquid officia veniam quo voluptatibus quas ratione ex, doloribus facilis omnis quaerat eos ab culpa.',
      closeable: true,
      timeout: Infinity,
      actions: [
        {
          label: 'Action 1',
          onClick: () => {
            console.log('Action 1')
          }
        },
        {
          label: 'Action 2',
          onClick: () => {
            console.log('Action 2')
          }
        }
      ]
    })
  }

  function openFullModal() {
    modal.open({
      title: 'Personal Information',
      content: Mock,
      fullScreen: true,
      closeable: true,
      actions: MODAL.PRESET_ACTION_CLOSE('OK')
    })
  }

  function openModal() {
    modal.open({
      icon: 'material-symbols:info-outline',
      title: 'Modal Title',
      content: Mock,
      closeable: true,
      actions: MODAL.PRESET_ACTION_CLOSE('OK')
    })
  }
</script>

<template>
  <Button @click="openFullModal">Open Full Modal</Button>
  <Button @click="openModal">Open Simple Modal</Button>
  <Button @click="openSnackbar">Open Snackbar</Button>
</template>
