<script setup lang="ts">
  import { useModal } from '@/components/Modal/modal-manager'
  import { MODAL } from '@/components/Modal/util'
  import { useSheet } from '@/components/Sheet/sheet-manager'
  import { useSnackbar } from '@/components/Snackbar/snackbar-manager'
  import { useToast } from '@/components/Toast/toast-manager'
  import { useLocalStorage } from '@/ref/use-local-storage'
  import { h } from 'vue'

  import Box from '@/components/Box/box.vue'
  import Button from '@/components/Button/button.vue'
  import Select from '@/components/Select/select.vue'
  import Mock from './mock-content.vue'
  import IconButton from '@/components/Button/icon-button.vue'

  const snackbar = useSnackbar()
  const modal = useModal()
  const sheet = useSheet()
  const toast = useToast()

  const options = ['left', 'right', 'bottom', 'top'] as const
  const position = useLocalStorage<'left' | 'right' | 'bottom' | 'top'>(
    'position',
    'right'
  )

  function openSnackbar() {
    snackbar.open({
      message: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, 
        voluptatibus! Modi maxime perspiciatis id ab neque! Ab, ea eius! 
        Alias expedita aspernatur enim debitis reiciendis similique ipsa 
        saepe suscipit voluptates.`,
      closeable: true,
      timeout: Infinity,
      actions: [
        {
          label: 'Action 1',
          onClick: () => console.log('Action 1')
        },
        {
          label: 'Action 2',
          onClick: () => console.log('Action 2')
        }
      ]
    })

    console.log(snackbar)
  }

  function openFullModal() {
    modal.open({
      title: 'Personal Information',
      content: Mock,
      fullScreen: true,
      closeable: true,
      subAction: h(IconButton, {
        icon: 'material-symbols:info-outline',
        onClick: () => openModal()
      }),
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

  function openSheet() {
    sheet.open({
      content: Mock,
      closeable: true,
      resizable: true,
      title: 'Sheet Title',
      direction: position.value
    })
  }

  function openToast() {
    toast.open({
      message: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, 
        voluptatibus! Modi maxime perspiciatis id ab neque! Ab, ea eius! 
        Alias expedita aspernatur enim debitis reiciendis similique ipsa 
        saepe suscipit voluptates.`
    })
  }

  function openExtendedToast() {
    toast.open({
      variant: 'expanded',
      message: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, 
        voluptatibus! Modi maxime perspiciatis id ab neque! Ab, ea eius! 
        Alias expedita aspernatur enim debitis reiciendis similique ipsa 
        saepe suscipit voluptates.`
    })
  }
</script>

<template>
  <Box>
    <p>Modals</p>
    <Button @click="openFullModal">Open Full Modal</Button>
    <Button @click="openModal">Open Simple Modal</Button>
  </Box>

  <Box>
    <p>Snackbars</p>
    <Button @click="openSnackbar">Open Snackbar</Button>
  </Box>

  <Box>
    <p>Sheets</p>
    <Select
      :items="[...options]"
      @change="([v]) => (position = v as typeof position)"
      :value="[position]"
    />
    <Button @click="openSheet">Open Sheet</Button>
  </Box>

  <Box>
    <p>Toasts</p>
    <Button @click="openToast">Open Toast</Button>
    <Button @click="openExtendedToast">Open Extended Toast</Button>
  </Box>
</template>
