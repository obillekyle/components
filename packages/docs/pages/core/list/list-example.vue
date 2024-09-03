<script setup lang="ts">
  import { Button, Flex, List } from '@vue-material/core'
  import { ref } from 'vue'

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
      label: 'Item 2'
    },
    {
      value: 3,
      label: 'Item 3'
    }
  ]

  const items = ref(defaultItems)
</script>

<template>
  <Flex direction="column" align="center" p="#md" width="100%">
    <List v-model="items" sortable swipe="dismiss" />
    <Button @click="items = defaultItems" label="Reset" />
  </Flex>
</template>
