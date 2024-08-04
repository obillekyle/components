<script setup lang="ts">
  import { CircularProgress } from '@vue-material/core'
  const reload = location.reload
</script>

<template>
  <div class="content-loader">
    <CircularProgress />
    <p class="content-loader-too-long">
      Page is taking too long to load? Try
      <a @click="reload">refreshing </a> the page
    </p>
  </div>
</template>

<style lang="scss">
  .content-loader {
    display: grid;
    place-items: center;
    position: absolute;
    inset: 0;

    &-too-long {
      opacity: 0;
      color: var(--outline);
      animation: text-fade 0.5s forwards ease-out;
    }

    @keyframes text-fade {
      to {
        opacity: 1;
      }
    }
  }
</style>
