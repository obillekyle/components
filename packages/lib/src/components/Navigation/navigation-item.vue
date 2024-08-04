<script setup lang="ts">
  import type { ButtonHTMLAttributes } from 'vue'

  import { Icon } from '@iconify/vue'
  import { computed, inject, ref } from 'vue'

  interface NavigationItemProps
    extends /** @vue-ignore */ ButtonHTMLAttributes {
    name?: string
    icon: string
    value?: number
  }

  const element = ref<HTMLElement>()
  const active = inject('active', ref(0))
  const root = inject('parent', ref<HTMLDivElement>())
  const props = defineProps<NavigationItemProps>()

  defineOptions({ name: 'MdNavigationItem' })

  const index = computed({
    get: () => {
      if (props.value) return props.value

      if (root.value) {
        const parent = root.value

        return [...parent.children]
          .filter((e) => e.matches('button.md-navbar-item.special'))
          .indexOf(element.value!)
      }
      return 0
    },
    set: () => {}
  })
</script>

<template>
  <button
    ref="element"
    class="md-navbar-item special"
    @click="active = value ?? index"
    :class="{ active: (value ?? index) == active }"
  >
    <div class="md-navbar-item-icon">
      <Icon :icon="icon" />
    </div>
    <div class="md-navbar-item-name">
      <slot>{{ name }}</slot>
    </div>
  </button>
</template>
