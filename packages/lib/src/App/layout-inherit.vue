<script setup lang="ts">
  import Box from '@/components/Box/box.vue'
  import Button from '@/components/Button/button.vue'
  import Layout from '@/components/Layout/layout.vue'
  import List from '@/components/List/list.vue'
  import LinearProgressSvg from '@/components/Progress/linear-progress-svg.vue'
  import Skeleton from '@/components/Skeleton/skeleton.vue'
  import Slider from '@/components/Slider/slider.vue'
  import Switch from '@/components/Switch/switch.vue'
  import Text from '@/components/Text/text.vue'

  import { customRef } from '@/ref/custom-ref'
  import { useFocusLock } from '@/ref/use-focus-lock'
  import { useLocalStorage } from '@/ref/use-local-storage'
  import { ref } from 'vue'

  const isDark = ref(true)
  const [root, setRoot] = customRef<HTMLElement>()
  const progress = useLocalStorage('progress', 80)
  const focusLock = useFocusLock(root)
</script>

<template>
  <Box class="layout-wrapper" width="100%" :height="600" :ref="setRoot">
    <Layout inherit :options="{ colors: { primary: 'orange' } }">
      <Button
        left-icon="material-symbols:lock-outline"
        @click="focusLock = !focusLock"
      >
        Toggle Focus Lock
      </Button>
      <Text> State of focus lock: {{ focusLock }} </Text>

      <Switch v-model="isDark" />
      <Text :p="isDark ? '#sm' : '#lg'">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
        {{ focusLock }}
      </Text>
      <LinearProgressSvg :value="progress" />
      <Slider v-model="progress" :decimal="2" />

      <Skeleton
        >Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Exercitationem explicabo officia harum tempora rerum optio culpa
        consequuntur aspernatur doloribus inventore. Totam, dignissimos in.
        Distinctio nemo amet veritatis doloremque sed molestiae.
      </Skeleton>
      <List :items="['a', 'b', 'c', 'd']" swipe="dismiss" />
    </Layout>
  </Box>
</template>

<style lang="scss">
  .layout-wrapper {
    position: relative;
    contain: content;
    border: 1px solid var(--surface-container);
  }
</style>
