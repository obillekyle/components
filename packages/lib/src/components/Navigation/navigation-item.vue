<script setup lang="ts">
  import type { ButtonHTMLAttributes, Component } from 'vue'

  import { keyClick } from '@/utils/dom/events'
  import { computed, inject, ref } from 'vue'

  import HybridComponent from '../Misc/hybrid-component.vue'
  import HybridIcon from '../Misc/hybrid-icon.vue'

  interface NavigationItemProps
    extends /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'name'> {
    name?: string | Component
    icon: string | Component
    value?: number
  }

  const element = ref<HTMLElement>()
  const active = inject('active', ref(0))
  const root = inject('parent', ref<HTMLDivElement>())
  const props = defineProps<NavigationItemProps>()

  defineOptions({ name: 'MdNavigationItem' })

  const index = computed(() => {
    if (props.value) return props.value

    if (root.value) {
      const parent = root.value

      return [...parent.children]
        .filter((e) => e.matches('button.md-navbar-item.special'))
        .indexOf(element.value!)
    }
    return Number.NaN
  })
</script>

<template>
  <button
    ref="element"
    @keypress="keyClick"
    class="md-navbar-item special"
    @pointerup="active = value ?? index"
    :class="{ active: (value ?? index) == active }"
  >
    <HybridIcon class="md-navbar-item-icon" :icon />
    <div class="md-navbar-item-name">
      <slot>
        <HybridComponent :as="name" />
      </slot>
    </div>
  </button>
</template>
