<script setup lang="ts">
  import { type ButtonHTMLAttributes } from 'vue'

  import { Icon } from '@iconify/vue'

  interface NavigationItemProps
    extends /** @vue-ignore */ ButtonHTMLAttributes {
    name?: string
    icon: string
  }

  defineProps<NavigationItemProps>()

  defineOptions({
    name: 'MdNavigationEntry',
    inheritAttrs: false
  })
</script>

<template>
  <button ref="element" v-bind="$attrs" class="md-nav-item entry">
    <div class="md-navbar-item-icon">
      <Icon :icon="icon" />
    </div>
    <div class="md-navbar-item-name">
      <slot>{{ name }}</slot>
    </div>
  </button>
</template>
