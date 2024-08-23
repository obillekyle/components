<script setup lang="ts">
  import '@/assets/tooltip.scss'
  import { customRef } from '@/utils/ref/custom-ref'
  import { useRect } from '@/utils/ref/use-rect'
  import { onMounted, onUnmounted } from 'vue'

  let floater: HTMLElement | undefined
  let timeout: any
  let title = ''

  const [root, setRoot] = customRef<HTMLElement>()
  const rootRect = useRect(root)

  defineOptions({
    name: 'MdTest'
  })

  const props = defineProps<{
    text?: string
  }>()

  function onEnter() {
    const element = root.value
    const rect = rootRect.value

    if (element && rect) {
      title = element.title
      element.title = ''

      floater = document.createElement('div')
      floater.textContent = props.text ?? title
      floater.className = 'md-tooltip'
      const onBottom = rect.top < rect.height
      const top = onBottom ? rect.top + rect.height : rect.top

      const left = rect.width / 2 + rect.left

      floater.style.top = `${top}px`
      floater.style.left = `${left}px`
      floater.classList.toggle('bottom', onBottom)

      element.before(floater)
    }

    timeout && clearTimeout(timeout)
    timeout = setTimeout(() => {
      floater?.classList.add('show')
    }, 800)
  }

  function onLeave() {
    const element = root.value
    if (floater && element) {
      element.title = title
      if (floater.classList.contains('show')) {
        floater.classList.remove('show')
        floater.addEventListener('transitionend', (e: any) => {
          e.currentTarget?.remove()
        })
        return
      }
      timeout && clearTimeout(timeout)
      floater.remove()
    }
  }

  onMounted(() => {
    const element = root.value

    if (element) {
      element.addEventListener('mouseenter', onEnter)
      element.addEventListener('mouseleave', onLeave)
    }
  })

  onUnmounted(() => {
    const element = root.value

    if (element) {
      element.removeEventListener('mouseenter', onEnter)
      element.removeEventListener('mouseleave', onLeave)
    }
  })
</script>

<template>
  <component :is="$slots.default?.()[0]" :ref="setRoot" />
</template>
