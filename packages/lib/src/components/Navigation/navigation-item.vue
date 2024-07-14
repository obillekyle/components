<script setup lang="ts">
  import type { NavigationBarProps } from './type'
  import type { Ref, ButtonHTMLAttributes } from 'vue'

  import { Icon } from '@iconify/vue'
  import { evaluate } from '@/utils/object'
  import { inject, onMounted, onUnmounted, ref, watch } from 'vue'
  import { $ } from '@/utils/dom'

  interface NavigationItemProps
    extends /** @vue-ignore */ ButtonHTMLAttributes {
    name?: string
    icon: string
    value?: number
  }

  const index = ref<number>(0)
  const element = ref<HTMLElement | null>(null)
  const count = inject<Ref<number>>('count')!
  const parentProps = inject<NavigationBarProps>('parent-props')!
  const root = inject<Ref<HTMLDivElement | null>>('parent')!

  const props = defineProps<NavigationItemProps>()
  defineOptions({ name: 'MdNavigationItem' })

  function updateIndex() {
    if (root.value) {
      const parent = $('.md-navbar-container', root.value) ?? root.value

      index.value = Array.from(parent.children)
        .filter((e) => e.matches('button.md-navbar-item.special'))
        .indexOf(element.value!)
    }
  }

  function setValue() {
    if (parentProps.active !== (props.value ?? index.value)) {
      evaluate(parentProps.change, props.value ?? index.value)
    }
  }

  watch(count, updateIndex)

  onMounted(() => {
    count.value += 1
    updateIndex()
  })

  onUnmounted(() => {
    count.value -= 1
  })
</script>

<template>
  <button
    ref="element"
    @click="setValue"
    class="md-navbar-item special"
    :class="{ active: (value ?? index) == parentProps.active }"
  >
    <div class="md-navbar-item-icon">
      <Icon :icon="icon" />
    </div>
    <div class="md-navbar-item-name">
      <slot>{{ name }}</slot>
    </div>
  </button>
</template>
