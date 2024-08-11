<script setup lang="ts">
  import Box from '@/components/Box/box.vue'
  import Button from '@/components/Button/button.vue'
  import Layout from '@/components/Layout/layout.vue'
  import LinearProgressSvg from '@/components/Progress/linear-progress-svg.vue'
  import Slider from '@/components/Slider/slider.vue'
  import Switch from '@/components/Switch/switch.vue'
  import Text from '@/components/Text/text.vue'
  import { useLocalStorage } from '@/utils/ref/use-local-storage'
  import { ref } from 'vue'

  const isDark = ref(true)
  const progress = useLocalStorage('progress', 80)
</script>

<template>
  <Box class="layout-wrapper" width="100%" :height="500">
    <Layout inherit :options="{ colors: { primary: 'orange' } }">
      <Button label="Hello" right-icon="mdi:open-in-new" />
      <Switch v-model="isDark" />
      <Text :p="isDark ? '#sm' : '#lg'">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Text>
      <LinearProgressSvg :value="progress" />
      <Slider v-model="progress" />
    </Layout>
  </Box>
</template>

<style lang="scss">
  .layout-wrapper {
    position: relative;
    border: 1px solid var(--surface-container);
  }
</style>
