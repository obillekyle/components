<script setup lang="ts">
  import type { Component } from 'vue'

  import { addPX } from '@/utils/css/sizes'
  import { evaluate } from '@/utils/function/evaluate'
  import { customRef } from '@/utils/ref/custom-ref'
  import { computed, onBeforeUnmount, onMounted } from 'vue'

  type ViewObserverProps = {
    as?: string | Component
    apply?: string | Record<string, any>
    offset?: number
    threshold?: number
    parent?: HTMLElement
    onViewChange?: (visible: boolean) => void
  }

  const props = defineProps<ViewObserverProps>()
  const visible = defineModel<boolean>({
    default: false
  })

  const [root, setRef] = customRef<HTMLElement>()
  let observer: IntersectionObserver | undefined

  const applyProps = computed(() => {
    if (!visible.value) return {}
    if (typeof props.apply === 'string') return { class: props.apply }
    return props.apply || {}
  })

  const intersectionCallback: IntersectionObserverCallback = (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        visible.value = true
        evaluate(props.onViewChange, true)
      } else {
        visible.value = false
        evaluate(props.onViewChange, false)
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
