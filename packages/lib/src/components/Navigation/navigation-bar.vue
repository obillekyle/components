<script setup lang="ts">
  import { evaluate } from '@/utils/function/evaluate'
  import { computed, provide, ref, watch, type HTMLAttributes } from 'vue'
  import type { NavigationBarProps } from './type'

  const props = defineProps<
    NavigationBarProps & /* @vue-ignore */ HTMLAttributes
  >()
  defineOptions({ name: 'MdNavigationBar' })

  const parent = ref<HTMLElement>()
  const model = defineModel({ default: 0 })

  const active = computed({
    get: () => props.active ?? model.value,
    set: (value) => (model.value = value)
  })

  watch(model, (value) => {
    evaluate(props.onChange, value)
  })

  provide('active', active)
  provide('parent', parent)
</script>

<template>
  <div :class="['md-navbar', labels ?? 'always']" ref="parent">
    <slot />
  </div>
</template>

<style lang="scss">
  .md-navbar {
    display: flex;
    position: absolute;
    overflow: hidden;
    flex-direction: column;
    top: 0;
    left: 0;
    bottom: 0;
    width: var(--navbar-size, 88px);
    background: var(--surface-container);

    &-container {
      display: flex;
      position: absolute;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin: auto;
    }

    &-container + &-content {
      margin-top: auto;
    }

    &-item {
      display: grid;
      font: inherit;
      border: none;
      justify-content: center;
      background: none;
      user-select: none;
      color: var(--on-surface-variant);
      padding-block: var(--sm);

      * {
        pointer-events: none;
      }

      &-icon {
        contain: content;
        place-self: end center;
        border-radius: 999px;
        display: grid;
        position: relative;
        overflow: hidden;
        place-items: center;
        width: var(--component-xl);
        height: var(--icon-xl);
        font-size: var(--icon-md);
        transition:
          background-color 0.2s,
          transform 0.2s;

        > * {
          transition: scale 0.2s;
        }

        &::before {
          z-index: -1;
          content: '';
          display: block;
          position: absolute;
          inset: 0;
          width: var(--icon-md);
          margin-inline: auto;
          transition:
            width 0.2s,
            background-color 0.2s;
          border-radius: inherit;
        }
      }

      &:active > &-icon > * {
        scale: 0.9;
      }

      &-name {
        font-size: var(--font-sm);
        padding-block: var(--xxs);
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        transform: translateY(0);
        transition:
          max-height 0.2s,
          transform 0.2s,
          opacity 0.2s;
      }
    }

    &.hidden &-item,
    &.active &-item {
      margin-bottom: 0;
      padding-top: var(--md);
      padding-bottom: 0;
    }

    &:active .icon > * {
      scale: 0.9;
    }

    &-item:hover &-item-icon {
      background: var(--surface);
    }

    &-item.active {
      .md-navbar-item-icon {
        color: var(--on-secondary-container);

        &::before {
          width: var(--size-lg);
          background: var(--secondary-container);
        }
      }

      .md-navbar-item-name {
        color: var(--on-surface);
      }
    }

    &.hidden &-item &-item-name,
    &.active &-item:not(.active) &-item-name {
      transform: translateY(50%);
      opacity: 0;
    }
  }

  @media screen and (width <= 600px) {
    .md-navbar {
      height: var(--navbar-size, 80px);
      inset: auto 0 0;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(0, 1fr));

      &:has(.md-navbar-container) {
        grid-template-columns: minmax(0, 1fr);
      }

      &-container {
        margin-block: 0;
        grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
        display: grid;
      }

      &.hidden &-item &-item-icon,
      &.active &-item:not(.active) &-item-icon {
        transform: translateY(40%);
      }

      &.hidden &-item.active,
      &.active &-item.active {
        .md-navbar-item-name {
          opacity: 1;
        }
      }

      &-content {
        display: none;
      }
    }
  }
</style>
