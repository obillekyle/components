<script setup lang="ts">
  import { CircularProgress } from '@vue-material/core'
  const reload = () => location.reload()
</script>

<template>
  <div class="content-loader">
    <CircularProgress />
    <p class="content-loader-too-long">
      Page taking too long to load? Try
      <a @click="reload" href="#">refreshing</a> the page.
    </p>
  </div>
</template>

<style lang="scss">
  .content-loader {
    display: flex;
    position: absolute;
    inset: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--lg);
    height: 80dvh;

    &-too-long {
      opacity: 0;
      color: var(--outline);
      animation: text-fade 4s forwards ease-out;
      text-wrap: balance;
      text-align: center;

      a {
        color: var(--primary);
      }
    }

    @keyframes text-fade {
      90% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }
  }
</style>
