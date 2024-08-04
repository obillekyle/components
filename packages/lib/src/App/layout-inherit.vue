<script setup lang="ts">
  import Box from '@/components/Box/box.vue'
  import Button from '@/components/Button/button.vue'
  import Layout from '@/components/Layout/layout.vue'
</script>

<template>
  <Box class="layout-wrapper" width="100%" :height="500">
    <Layout inherit>
      <Button label="Hello" right-icon="mdi:open-in-new" />
    </Layout>
  </Box>
</template>

<style lang="scss">
  .layout-wrapper {
    position: relative;
    border: 1px solid var(--surface-container);
  }
</style>
