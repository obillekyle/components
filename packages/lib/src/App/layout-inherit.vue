<script setup lang="ts">
  import Box from '@/components/Box/box.vue'
  import Button from '@/components/Button/button.vue'
  import Checkbox from '@/components/Input/checkbox.vue'
  import Form from '@/components/Form/form.vue'
  import Layout from '@/components/Layout/layout.vue'
  import List from '@/components/List/list.vue'
  import Switch from '@/components/Switch/switch.vue'
  import Text from '@/components/Text/text.vue'

  import { useLocalStorage } from '@/ref/use-local-storage'
  import { customRef } from '@/ref/custom-ref'
  import { useFocusLock } from '@/ref/use-focus-lock'
  import { ref } from 'vue'
  import TextInput from '@/components/Input/text.vue'
  import { useTooltip } from '@/ref/use-tooltip'
  import TabSwitcher from '@/components/AppBar/tab-switcher.vue'
  import TopBar from '@/components/AppBar/top-bar.vue'

  const isDark = ref(true)
  const [root, setRoot] = customRef<HTMLElement>()
  const focusLock = useFocusLock(root)
  useTooltip(root, 'class')

  const data = useLocalStorage('data', {})

  type Item = {
    value: number
    label: string
  }

  const defaultItems: Item[] = [
    {
      value: 1,
      label: 'Item 1'
    },
    {
      value: 2,
      label: 'Item 2 with a long label'
    },
    {
      value: 3,
      label:
        'Item 3 with a very very long label that reaches the line width limit'
    }
  ]

  const items = ref(defaultItems)
</script>

<template>
  <Box class="layout-wrapper" width="100%" :height="600" :ref="setRoot">
    <Layout inherit :options="{ colors: 'orange' }">
      <template #header>
        <TopBar headline="My App" />
        <TabSwitcher
          :items="[
            'This is tab 1',
            'This is tab 2',
            'This is tab 3',
            'This is tab 4',
            'This is tab 5',
            'This is tab 6',
            'This is tab 7',
            'This is tab 8',
            'This is tab 9',
            'This is tab 10'
          ]"
        />
      </template>

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
      </Text>

      <Checkbox />

      <List
        v-model="items"
        sortable
        swipe="custom"
        :swipe-options="{
          left: {
            color: 'red',
            icon: 'material-symbols:chevron-left',
            handler: console.log
          },
          right: {
            color: 'green',
            icon: 'material-symbols:chevron-right',
            handler: console.log
          }
        }"
      />

      <Form v-model="data">
        <TextInput name="test" />
        <Switch name="test-boolean" />
      </Form>

      <pre>
        <code>{{ JSON.stringify(data, null, 2) }}</code>
      </pre>
    </Layout>
  </Box>
</template>

<style lang="scss">
  .layout-wrapper {
    position: relative;
    contain: layout;
    border: 1px solid var(--surface-container);
  }
</style>
