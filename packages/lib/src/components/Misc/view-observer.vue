<script setup lang="ts">
  import type { Component } from 'vue'

  import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
  import { fnRef } from '@/utils/ref'
  import { addPX } from '@/utils/css'

  const props = defineProps<{
    as?: string | Component
    apply?: string | Record<string, any>
    change?: (isVisible: boolean) => void
    offset?: number
    threshold?: number
    parent?: HTMLElement
  }>()

  const isVisible = ref(false)
  const root = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  const applyProps = computed(() => {
    if (!isVisible.value) return {}
    if (typeof props.apply === 'string') return { class: props.apply }
    return props.apply || {}
  })

  const intersectionCallback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        props.change?.(true)
      } else {
        isVisible.value = false
        props.change?.(false)
      }
    })
  }

  onMounted(() => {
    observer = new IntersectionObserver(intersectionCallback, {
      rootMargin: addPX(props.offset || 0),
      root: props.parent ?? null,
      threshold: props.threshold
    })

    if (root.value) {
      observer.observe(root.value)
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  const setRef = fnRef(root)
  defineOptions({ name: 'MdViewObserver' })
</script>

<template>
  <component :ref="setRef" :is="as || 'div'" v-bind="applyProps" observe>
    <slot />
  </component>
</template>
