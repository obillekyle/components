<script setup lang="ts">
  import ModalProvider from '../Modal/modal-provider.vue'
  import SheetProvider from '../Sheet/sheet-provider.vue'
  import SnackbarProvider from '../Snackbar/snackbar-provider.vue'
  import ToastProvider from '../Toast/toast-provider.vue'

  defineOptions({ name: 'MdOverlayProvider', inheritAttrs: false })
</script>

<template>
  <ToastProvider>
    <SnackbarProvider>
      <ModalProvider>
        <SheetProvider>
          <slot />
        </SheetProvider>
      </ModalProvider>
    </SnackbarProvider>
  </ToastProvider>
</template>
