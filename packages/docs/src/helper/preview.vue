<script setup lang="ts">
  import Box from '@vue-material/core/Box'

  defineOptions({ name: 'MdPreview' })
</script>

<template>
  <Box class="preview" r="#xs">
    <slot />
  </Box>
</template>

<style lang="scss">
  .preview {
    width: 100%;
    max-height: 1200px;
    display: grid;
    margin-block: var(--sm) var(--xl);
    grid-template-rows: auto 1fr;
    overflow: hidden;
    box-shadow:
      0 0 0 1px var(--primary-90),
      var(--shadow-1);
    background-image: radial-gradient(
      var(--surface-container-highest) 1px,
      transparent 0
    );
    background-size: var(--lg) var(--lg);
    background-color: var(--primary-100);

    & + & {
      margin-top: calc(var(--sm) * -1) !important;
    }

    &-frame {
      width: 100%;
      display: grid;
      contain: content;
      position: relative;
      place-items: center;
      overflow: auto;
    }

    &-code {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
</style>
