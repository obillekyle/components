<script setup lang="ts">
  import { CircularProgress } from '@vue-material/core'
</script>

<template>
  <div class="content-loader">
    <CircularProgress />
  </div>
</template>

<style lang="scss">
  .content-loader {
    display: grid;
    place-items: center;
    position: absolute;
    inset: 0;
  }
</style>
