<script setup lang="ts">
  import { Action, ColorBlock, HybridIcon } from '@vue-material/core/Misc'
  import Flex from '@vue-material/core/Box/Flex'
</script>

<template>
  <div class="misc-examples">
    <!-- Action Example -->
    <div class="example-section">
      <h3>Action</h3>
      <Flex gap="#sm">
        <Action label="Action 1">
            <HybridIcon icon="material-symbols:add" />
        </Action>
        <Action label="Action 2" disabled>
            <HybridIcon icon="material-symbols:delete" />
        </Action>
      </Flex>
    </div>

    <!-- Color Block Example -->
    <div class="example-section">
      <h3>Color Block</h3>
      <Flex gap="#sm" wrap="wrap">
        <ColorBlock color="#F44336">Red</ColorBlock>
        <ColorBlock color="#2196F3" text="white">Blue</ColorBlock>
        <ColorBlock color="primary">Primary</ColorBlock>
      </Flex>
    </div>

    <!-- Hybrid Icon Example -->
    <div class="example-section">
      <h3>Hybrid Icon</h3>
      <Flex gap="#sm" align="center">
        <HybridIcon icon="material-symbols:home" size="24px" />
        <HybridIcon icon="mdi:account" size="#xl" />
      </Flex>
    </div>
  </div>
</template>

<style scoped>
.misc-examples {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}
.example-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
