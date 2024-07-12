<script setup lang="ts">
  import type { NavigationBarProps } from './type'
  import { type HTMLAttributes, provide, ref } from 'vue'

  interface Props
    extends NavigationBarProps,
      /* @vue-ignore */ HTMLAttributes {}

  const props = withDefaults(defineProps<Props>(), {
    labels: 'always',
    active: -1
  })
  const count = ref(0)
  const parent = ref<HTMLDivElement | null>(null)

  provide('parent-props', props)
  provide('parent', parent)
  provide('root', parent)
  provide('count', count)
</script>

<template>
  <div class="md-navbar" :class="labels" ref="parent">
    <slot />
  </div>
</template>

<style lang="scss">
  .md-navbar {
    display: flex;
    position: absolute;
    flex-direction: column;
    height: 100dvh;
    left: 0;
    top: 0;
    bottom: 0;
    width: var(--navbar-size, 88px);
    background: var(--primary-10);

    .md-navbar-container {
      display: flex;
      position: absolute;
      justify-content: center;
      flex-direction: column;
      inset: 0;
    }

    .md-navbar-container + .md-navbar-content {
      margin-top: auto;
    }

    .md-navbar-item {
      display: grid;
      font: inherit;
      border: none;
      justify-content: center;
      background: none;
      user-select: none;
      color: var(--primary-80);
      padding-block: var(--padding-xs);
      margin-bottom: var(--padding-xs);

      * {
        pointer-events: none;
      }

      .md-navbar-item-icon {
        place-self: end center;
        margin-bottom: 4px;
        border-radius: 999px;
        display: grid;
        position: relative;
        overflow: hidden;
        place-items: center;
        width: var(--size-sm);
        height: var(--icon-lg);
        font-size: var(--icon-md);
        transition: background-color 0.2s;

        * {
          transition: scale 0.2s;
        }

        &::before {
          z-index: -1;
          content: '';
          display: block;
          position: absolute;
          inset: 0;
          width: var(--icon-lg);
          margin-inline: auto;
          transition:
            width 0.2s,
            background-color 0.2s;
          border-radius: inherit;
        }
      }

      .md-navbar-item-name {
        font-size: var(--font-xs);
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

    &.hidden .md-navbar-item,
    &.active .md-navbar-item {
      margin-bottom: 0;
      padding-top: var(--md);
      padding-bottom: 0;
    }

    .md-navbar-item:active .icon > * {
      scale: 0.9;
    }

    .md-navbar-item:hover .icon {
      background-color: var(--primary-40-20);
    }

    .md-navbar-item.active {
      .md-navbar-item-icon {
        color: var(--on-primary-container);

        &::before {
          background-color: var(--primary-container);
          width: var(--size-lg);
        }
      }

      .md-navbar-item-name {
        color: var(--primary-90);
      }
    }

    &.hidden .md-navbar-item .name,
    &.active .md-navbar-item:not(.active) .name {
      transform: translateY(50%);
      opacity: 0;
    }
  }

  @media screen and (width <= 600px) {
    .md-navbar {
      width: 100dvw;
      height: var(--navbar-size, 88px);
      inset: auto 0 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(0, 1fr));

      &:has(.md-navbar-container) {
        grid-template-columns: minmax(0, 1fr);
      }

      .md-navbar-container {
        margin-block: 0;
        grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
        display: grid;
      }

      .md-navbar-item {
        margin-bottom: 0;
        padding-top: var(--padding-sm);

        .md-navbar-item-name {
          font-size: var(--font-md);
        }

        .md-navbar-item-icon {
          height: var(--icon-xl);
          width: var(--size-md);
          transition: transform 0.25s var(--timing-standard);
        }

        &.active {
          .md-navbar-item-icon::before {
            width: var(--size-md);
          }
        }
      }

      &.hidden .md-navbar-item .name,
      &.active .md-navbar-item:not(.active) .name {
        opacity: 0;
        transform: translateY(100%);
      }

      &.hidden .md-navbar-item .icon,
      &.active .md-navbar-item:not(.active) .icon {
        transform: translateY(20%);
      }

      &.hidden .md-navbar-item.active,
      &.active .md-navbar-item.active {
        .name {
          opacity: 1;
          transform: translateY(-25%);
        }

        .icon {
          transform: translateY(-15%);
        }
      }

      .md-navbar-content {
        display: none;
      }
    }
  }
</style>
