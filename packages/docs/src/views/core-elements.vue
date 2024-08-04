<script setup lang="ts">
  import { toPascalCase } from '@/helper/util'
  import { toKebabCase } from '@vue-material/core'
  import Box from '@vue-material/core/Box/box.vue'
  import ScrollContainer from '@vue-material/core/Layout/scroll-container.vue'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  const active = computed(() => {
    const path = route.path
    const paths = path.split('/')
    return toPascalCase(paths[2] ?? '')
  })

  const elements = [
    'AppBar',
    'Box',
    'Button',
    'Card',
    'Chip',
    'Image',
    'Progress',
    'Slider'
  ].sort()
</script>

<template>
  <ScrollContainer class="core-elements">
    <Box
      v-for="element in elements"
      :key="element"
      class="core-element"
      :class="active === element ? 'active' : ''"
      @click="router.push(`/core/${toKebabCase(element)}`)"
    >
      {{ element }}
    </Box>
  </ScrollContainer>
</template>

<style lang="scss">
  .core-element {
    padding: var(--md) var(--xl);
    cursor: pointer;
    border-radius: 999px;
    transition: background-color 0.1s ease-in-out;

    &:hover {
      background: var(--surface-container-low);
    }

    &.active {
      background: var(--primary-container);
      color: var(--on-primary-container);
    }
  }
</style>
