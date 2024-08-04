<script setup lang="ts">
  import type { Component } from 'vue'

  import { addPX } from '@/utils/css'
  import { customRef } from '@/utils/ref'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  const props = defineProps<{
    as?: string | Component
    apply?: string | Record<string, any>
    change?: (isVisible: boolean) => void
    offset?: number
    threshold?: number
    parent?: HTMLElement
  }>()

  const isVisible = ref(false)
  const [root, setRef] = customRef<HTMLElement>()
  let observer: IntersectionObserver | undefined

  const applyProps = computed(() => {
    if (!isVisible.value) return {}
    if (typeof props.apply === 'string') return { class: props.apply }
    return props.apply || {}
  })

  const intersectionCallback: IntersectionObserverCallback = (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        isVisible.value = true
        props.change?.(true)
      } else {
        isVisible.value = false
        props.change?.(false)
      }
    }
  }

  onMounted(() => {
    observer = new IntersectionObserver(intersectionCallback, {
      rootMargin: addPX(props.offset || 0),
      // eslint-disable-next-line unicorn/no-null
      root: props.parent ?? null,
      threshold: props.threshold
    })

    if (root.value) {
      observer.observe(root.value)
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = undefined
  })

  defineOptions({ name: 'MdViewObserver' })
</script>

<template>
  <component :ref="setRef" :is="as ?? 'div'" v-bind="applyProps" observe>
    <slot />
  </component>
</template>
