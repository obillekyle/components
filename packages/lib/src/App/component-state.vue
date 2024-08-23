<script setup lang="ts">
  import { useModal } from '@/components/Modal/modal-manager'
  import { MODAL } from '@/components/Modal/util'
  import { useSheet } from '@/components/Sheet/sheet-manager'
  import { useSnackbar } from '@/components/Snackbar/snackbar-manager'

  import Box from '@/components/Box/box.vue'
  import Button from '@/components/Button/button.vue'
  import Select from '@/components/Select/select.vue'
  import { useLocalStorage } from '@/utils'
  import Mock from './mock-content.vue'

  const snackbar = useSnackbar()
  const modal = useModal()
  const sheet = useSheet()

  const options = ['left', 'right', 'bottom', 'top'] as const
  const position = useLocalStorage<'left' | 'right' | 'bottom' | 'top'>(
    'position',
    'right'
  )

  function openSnackbar() {
    snackbar.open({
      message:
        'Hello World! Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, reprehenderit et. Impedit aperiam neque laborum aliquid officia veniam quo voluptatibus quas ratione ex, doloribus facilis omnis quaerat eos ab culpa.',
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
</script>

<template>
  <Box>
    <Button @click="openFullModal">Open Full Modal</Button>
    <Button @click="openModal">Open Simple Modal</Button>
  </Box>

  <Box>
    <Button @click="openSnackbar">Open Snackbar</Button>
  </Box>

  <Box>
    <Select
      :items="[...options]"
      @change="([v]) => (position = options[v])"
      :value="[options.indexOf(position) || 0]"
    />
    <Button @click="openSheet">Open Sheet</Button>
  </Box>
</template>
