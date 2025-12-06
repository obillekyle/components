<script setup lang="ts">
  import { Snackbar } from '@vue-material/core/Snackbar'
</script>

<template>
  <div class="snackbar-preview-container">
    <Snackbar
      class="static"
      message="This is a snackbar"
      :actions="[{ label: 'Action' }]"
    />
  </div>
</template>

<style scoped>
.snackbar-preview-container {
  height: 100%;
  padding-bottom: 20px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
</style>
