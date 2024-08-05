<script setup lang="ts">
  import { Button, Text } from '@vue-material/core'
  import {
    computed,
    inject,
    onBeforeUnmount,
    onMounted,
    ref,
    watch
  } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import {
    handleContentClick,
    scrollTo,
    scrollToHash
  } from './content-utils'

  const route = useRoute()
  const router = useRouter()
  const hash = computed(() => route.hash)
  const content = inject('content', ref<HTMLElement>())
  const headers = inject('headers', ref<HTMLElement[]>([]))

  watch(hash, (hash) => scrollToHash(content.value!, hash))
  watch(headers, () => {
    setTimeout(() => {
      const parent = content.value!
      scrollToHash(parent, route.hash)
    }, 200)
  })

  const handleClick = (e: MouseEvent) => handleContentClick(e, router)

  onMounted(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    const parent = content.value!
    parent?.addEventListener('click', handleClick)
  })

  onBeforeUnmount(() => {
    const parent = content.value!
    parent?.removeEventListener('click', handleClick)
  })
</script>

<template>
  <div class="content-outline" :weight="600" py="#sm">
    <Text v-if="headers.length > 0" class="content-outline-title" pl="#sm">
      On this page
    </Text>

    <Button
      variant="text"
      v-for="header in headers"
      :key="header.id"
      :ml="['H1', 'H2'].includes(header.tagName) ? '0' : '#sm'"
      class="content-outline-item"
      @click="scrollTo(content!, header)"
    >
      {{ header.textContent }}
    </Button>
  </div>
</template>
