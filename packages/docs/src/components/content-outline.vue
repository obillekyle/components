<script setup lang="ts">
  import { Button, Text } from '@vue-material/core'
  import { computed, inject, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { scrollTo, scrollToHash } from './content-utils'

  const route = useRoute()
  const router = useRouter()
  const hash = computed(() => route.hash)
  const content = inject('content', ref<HTMLElement>())
  const headers = inject('headers', ref<HTMLElement[]>([]))

  watch(hash, (hash) => scrollToHash(content.value!, hash))
  watch(headers, () => {
    const parent = content.value!
    scrollToHash(parent, route.hash)
    if (headers.value.length > 0) {
      for (const head of headers.value) {
        head.addEventListener('click', () => {
          scrollToHash(parent, `#${head.id}`)
        })
      }
    }
  })

  onMounted(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    const parent = content.value!
    parent.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a') as HTMLAnchorElement
      if (link && !link.href) return

      if (link) {
        event.preventDefault()
        const isOutbound = link.host !== location.host
        if (isOutbound) window.open(link.href, '_blank')
        else if (link.pathname === location.pathname) {
          scrollToHash(parent, link.hash)
        } else {
          router.push(link.href + link.hash)
        }
      }
    })
  })
</script>

<template>
  <div class="content-outline" :weight="600" py="#sm">
    <Text v-if="headers.length > 0" class="content-outline-title" pl="#sm">
      On this page
    </Text>

    <Button
      @click="scrollTo(content!, header, 62)"
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
