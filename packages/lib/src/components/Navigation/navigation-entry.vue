<script setup lang="ts">
  import { type ButtonHTMLAttributes } from 'vue'

  import { Icon } from '@iconify/vue'

  interface NavigationItemProperties
    extends /** @vue-ignore */ ButtonHTMLAttributes {
    name?: string
    icon: string
  }

  defineProps<NavigationItemProperties>()
  defineOptions({ name: 'MdNavigationEntry' })
</script>

<template>
  <button ref="element" class="md-navbar-item entry">
    <div class="md-navbar-item-icon">
      <Icon :icon="icon" />
    </div>
    <div class="md-navbar-item-name">
      <slot>{{ name }}</slot>
    </div>
  </button>
</template>
