<script setup lang="ts">
  import type { Component } from 'vue'

  import { customRef } from '@/ref/custom-ref'
  import { addPX } from '@/utils/css/sizes'
  import { computed, onBeforeUnmount, onMounted } from 'vue'

  type ViewObserverProps = {
    as?: string | Component
    apply?: string | Record<string, any>
    offset?: string | number
    threshold?: number
    parent?: HTMLElement
  }

  type ViewObserverEmits = {
    (event: 'viewchange', visible: boolean): void
  }

  let observer: IntersectionObserver
  const emit = defineEmits<ViewObserverEmits>()
  const props = defineProps<ViewObserverProps>()
  const visible = defineModel<boolean>({ default: false })

  const [root, setRef] = customRef<HTMLElement>()

  const applyProps = computed(() => {
    if (!visible.value) return

    return typeof props.apply === 'string'
      ? { class: props.apply }
      : props.apply
  })

  const intersectionCallback: IntersectionObserverCallback = ([entry]) => {
    visible.value = entry.isIntersecting
    emit('viewchange', entry.isIntersecting)
  }

  onMounted(() => {
    observer = new IntersectionObserver(intersectionCallback, {
      rootMargin: addPX(props.offset || 0),
      threshold: props.threshold
    })

    if (root.value) {
      observer.observe(root.value)
    }
  })

  onBeforeUnmount(() => observer.disconnect())
  defineOptions({ name: 'MdViewObserver' })
</script>

<template>
  <component :ref="setRef" :is="as ?? 'div'" v-bind="applyProps" observe>
    <slot />
  </component>
</template>
