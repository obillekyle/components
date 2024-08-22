<script setup lang="ts">
  import type { ButtonHTMLAttributes, Component } from 'vue'

  import HybridComponent from '../Misc/hybrid-component.vue'
  import HybridIcon from '../Misc/hybrid-icon.vue'

  interface NavigationItemProperties
    extends /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'name'> {
    name?: string | Component
    icon: string | Component
  }

  defineProps<NavigationItemProperties>()
  defineOptions({ name: 'MdNavigationEntry' })
</script>

<template>
  <button ref="element" class="md-navbar-item entry">
    <HybridIcon class="md-navbar-item-icon" :icon />
    <div class="md-navbar-item-name">
      <slot>
        <HybridComponent :as="name" />
      </slot>
    </div>
  </button>
</template>
