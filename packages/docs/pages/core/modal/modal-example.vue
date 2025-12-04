<script setup lang="ts">
  import { Modal } from '@vue-material/core/Modal'
</script>

<template>
  <div class="modal-preview-container">
    <Modal
      title="Basic Modal"
      content="This is a simple modal dialog."
      :actions="[{ label: 'Close' }]"
    />
  </div>
</template>

<style scoped>
.modal-preview-container {
  height: 300px;
  position: relative;
  overflow: hidden;
  background: var(--surface-container-low);
}
</style>
