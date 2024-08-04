<script setup lang="ts">
  import { Box, List } from '@vue-material/core'
  import { ref } from 'vue'

  type Item = {
    id: number
    props: Record<string, any>
  }

  const items = ref<Item[]>([
    {
      id: 1,
      props: {
        name: 'Item 1'
      }
    },
    {
      id: 2,
      props: {
        name: 'Item 2'
      }
    },
    {
      id: 3,
      props: {
        name: 'Item 3'
      }
    }
  ])

  function dismiss(id: number) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  function reorder(from: number, to: number) {
    const item = items.value[from]
    items.value.splice(from, 1)
    items.value.splice(to, 0, item)
  }
</script>

<template>
  <Box p="#md" width="100%">
    <List
      :items
      sortable
      swipe="dismiss"
      @reorder="reorder"
      @dismiss="dismiss"
    />
  </Box>
</template>
