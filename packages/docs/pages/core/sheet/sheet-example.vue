<script setup lang="ts">
  import { Sheet } from '@vue-material/core/Sheet'
</script>

<template>
  <div class="sheet-preview-container">
    <Sheet direction="left" title="Navigation Drawer" :resizable="false" :closeable="false" style="position: absolute;">
       <div style="padding: 16px;">
         Sheet Content
       </div>
    </Sheet>
  </div>
</template>

<style scoped>
.sheet-preview-container {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: var(--surface-container-low);
}
</style>
