<script setup lang="ts">
  import { $, Button, Text } from '@vue-material/core'
  import animatedScrollTo from 'animated-scroll-to'
  import { inject, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const content = inject('content', ref<HTMLElement>())
  const headers = inject('headers', ref<HTMLElement[]>([]))

  function scrollTo(header: HTMLElement) {
    const parent = content.value
    if (!parent) return

    animatedScrollTo(header, {
      elementToScroll: parent
    }).then(() => {
      location.hash = header.id
    })
  }

  watch(
    () => route.hash,
    () => {
      if (route.hash.length > 1) {
        const header = $(route.hash)
        header && scrollTo(header)
      }
    }
  )

  watch(headers, () => {
    if (route.hash.length > 1) {
      const header = $(route.hash)
      header && scrollTo(header)
    }
    if (headers.value.length > 0) {
      for (const head of headers.value) {
        head.addEventListener('click', () => scrollTo(head))
      }
    }
  })
</script>

<template>
  <div class="content-outline" :weight="600" py="#sm">
    <Text v-if="headers.length > 0" class="content-outline-title" pl="#sm">
      On this page
    </Text>

    <Button
      @click="scrollTo(header)"
      v-for="header in headers"
      :key="header.id"
      variant="text"
      :ml="['H1', 'H2'].includes(header.tagName) ? '0' : '#sm'"
      class="content-outline-item"
    >
      {{ header.textContent }}
    </Button>
  </div>
</template>
