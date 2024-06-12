<script setup lang="ts">
  import type { ButtonHTMLAttributes } from 'vue'
  import type { AppSizes } from '@/utils/css'

  import { Icon } from '@iconify/vue'
  import { getCSSValue } from '@/utils/css'
  import { rippleEffect } from '@/utils/dom'

  interface IconButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
    icon: string
    size?: AppSizes | number | String
  }

  defineProps<IconButtonProps>()

  defineOptions({
    name: 'MdIconButton',
    inheritAttrs: false
  })
</script>

<template>
  <button class="md-icon-button" type="button" v-bind="$attrs">
    <div class="md-icon-wrapper" @pointerdown="rippleEffect">
      <Icon
        :icon="icon"
        :style="{ fontSize: getCSSValue(size ?? 'md', 'px', 'icon') }"
      />
    </div>
  </button>
</template>

<style lang="scss" scoped>
  .md-icon-button {
    display: block;
    background: none;
    outline: none;
    color: var(--primary-90, inherit);
    border: none;
    -webkit-tap-highlight-color: transparent;

    .md-icon-wrapper {
      display: grid;
      place-items: center;
      place-content: center;
      position: relative;
      overflow: hidden;
      width: 48px;
      height: 48px;
      border-radius: 999px;
      transition: background-color 0.2s;

      * {
        pointer-events: none;
      }
    }

    &:disabled .icon-wrapper {
      color: var(--mono-50);
      pointer-events: none;
    }

    &:hover:not(:disabled) .icon-wrapper {
      background-color: var(--primary-60-20);
      cursor: pointer;
    }

    &:focus-visible {
      .md-icon-wrapper {
        outline: 2px dashed var(--primary-60);
        background-color: var(--primary-60-20);
      }
    }
  }
</style>
