<script setup lang="ts">
  import { $, Button, Text } from '@vue-material/core'
  import animatedScrollTo from 'animated-scroll-to'
  import { inject, onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const content = inject('content', ref<HTMLElement>())
  const headers = inject('headers', ref<HTMLElement[]>([]))

  function scrollTo(header: HTMLElement, animate = true) {
    if (!content.value) return
    const parent = content.value
    const top = (header.offsetTop || 0) - 62
    history.replaceState(true, '', `#${header.id}`)

    if (animate) {
      animatedScrollTo(top, {
        elementToScroll: parent
      })
    } else {
      parent.scrollTop = top
    }
  }

  watch(headers, () => {
    if (route.hash.length > 1) {
      setTimeout(() => {
        const header = $(route.hash)
        header && scrollTo(header)
      }, 200)
    }
    if (headers.value.length > 0) {
      for (const head of headers.value) {
        head.addEventListener('click', () => scrollTo(head))
      }
    }
  })

  onMounted(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
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
