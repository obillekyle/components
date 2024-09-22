<script setup lang="ts">
  import type { UtilityFunction } from '@/utils/component-manager'
  import type { SheetProps } from './util'

  import { useDrag } from '@/ref/use-drag'
  import { useFocusLock } from '@/ref/use-focus-lock'
  import { useRect } from '@/ref/use-rect'
  import { createStyle } from '@/utils/css/create-style'
  import { keyClick, targetsSelf } from '@/utils/dom/events'
  import { Icon } from '@iconify/vue'
  import { computed, provide, ref, watch } from 'vue'

  import CM from '@/utils/component-manager'
  import ScrollContainer from '../Layout/scroll-container.vue'
  import HybridComponent from '../Misc/hybrid-component.vue'

  interface SheetOptions extends SheetProps {
    utils?: UtilityFunction<SheetProps>
  }

  defineOptions({ name: 'MdModal' })
  const props = defineProps<SheetOptions>()
  const utils = computed(() => props.utils ?? CM.DEFAULT_UTILITY)

  const root = ref<HTMLElement>()
  const setSize = ref<number>()
  const rect = useRect(root)

  const size = computed({
    get: () => setSize.value ?? props.size,
    set: (value) => (setSize.value = value)
  })

  const property = computed(() =>
    ['left', 'right'].includes(props.direction || '') ? 'width' : 'height'
  )

  const className = createStyle(() => ({
    [property.value]: size.value && Math.max(0, size.value)
  }))

  type PosFn = (pos: DOMRect) => void
  const positions: Record<string, PosFn> = {
    top: ({ y }) => (setSize.value = y),
    left: ({ x }) => (setSize.value = x),
    right: ({ x, width }) => (setSize.value = width - x),
    bottom: ({ y, height }) => (setSize.value = height - y)
  }

  useFocusLock(root)

  const [dragging, dragHandler] = useDrag((position) => {
    if (!rect.ready) return
    const { x, y } = position
    const { height, width } = rect
    positions[props.direction!]({ x, y, width, height } as DOMRect)
  })

  watch(dragging, (value) => {
    if (value === false && (size.value ?? 0) < 250) {
      props.closeable ? utils.value.close() : (setSize.value = undefined)
    }
  })

  provide('sheet-utils', utils)
</script>

<template>
  <div
    ref="root"
    class="md-sheet"
    :class="{
      [direction ?? 'left']: true,
      static: Number.isNaN(utils.id)
    }"
    @click="closeable && targetsSelf($event, utils.close)"
  >
    <div class="md-sheet-wrapper" :class="className">
      <div class="md-sheet-title" v-if="title || $slots.title">
        <slot name="title">
          <HybridComponent :as="title" />
        </slot>
        <div
          class="md-sheet-close"
          @keypress="keyClick"
          @click="utils.close"
          v-if="closeable"
          tabindex="0"
        >
          <Icon :inline="false" :width="24" icon="material-symbols:close" />
        </div>
      </div>

      <ScrollContainer class="md-sheet-content" p="0" tabindex="0">
        <slot>
          <HybridComponent :as="content" />
        </slot>
      </ScrollContainer>

      <div
        v-if="resizable"
        :class="{ dragging }"
        class="md-sheet-handle"
        @pointerdown="dragHandler"
      />
    </div>
  </div>
</template>

<style lang="scss">
  /* stylelint-disable no-descending-specificity */

  .md-sheet {
    inset: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 1000;
    display: grid;
    background: #0008;

    &-wrapper {
      display: grid;
      grid-template:
        'title' var(--component-lg)
        'content' auto;
      position: absolute;
      overflow: hidden;
      padding-top: var(--xl);
      background: var(--surface-container-high);
      border-radius: var(--xxl);
      min-width: min(350px, 100%);
      width: 500px;
      max-width: 75%;
      max-height: 100%;

      &:not(:has(.md-sheet-handle.dragging)) {
        transition:
          width 0.3s var(--timing-standard),
          height 0.3s var(--timing-standard);
      }
    }

    &-enter-active,
    &-leave-active {
      transition: opacity 0.3s var(--timing-standard);

      .md-sheet-wrapper {
        transform-origin: center;
        transition: translate 0.3s var(--timing-standard) !important;
      }
    }

    &.right &-wrapper {
      height: 100%;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      right: 0;

      &:has(.md-sheet-handle) {
        padding-left: var(--xs);
      }
    }

    &.left &-wrapper {
      height: 100%;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      left: 0;

      &:has(.md-sheet-handle) {
        padding-right: var(--xs);
      }
    }

    &.bottom &-wrapper {
      width: 100%;
      max-width: 768px;
      justify-self: center;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      bottom: 0;

      &:has(.md-sheet-handle) {
        padding-top: var(--xs);
      }
    }

    &.top &-wrapper {
      width: 100%;
      max-width: 768px;
      justify-self: center;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      padding-top: var(--sm);
      top: 0;
      grid-template:
        'title' var(--component-lg)
        'content' auto
        'other' var(--xl);

      &:has(.md-sheet-handle) {
        padding-bottom: var(--xs);
      }
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
      pointer-events: none;

      &.left .md-sheet-wrapper {
        translate: -100% 0;
      }

      &.right .md-sheet-wrapper {
        translate: 100% 0;
      }

      &.bottom .md-sheet-wrapper {
        translate: 0 100%;
      }

      &.top .md-sheet-wrapper {
        translate: 0 -100%;
      }
    }

    &-handle {
      display: grid;
      position: absolute;
      place-items: center;

      &.dragging::before {
        background: var(--outline);
      }

      &::before {
        content: '';
        position: absolute;
        border-radius: 999px;
        background: var(--on-surface-variant);
      }
    }

    &.bottom &-handle,
    &.top &-handle {
      width: 100%;
      height: var(--xl);

      &::before {
        width: var(--component-xs);
        height: var(--xxs);
      }
    }

    &.left &-handle,
    &.right &-handle {
      width: var(--xl);
      height: 100%;

      &::before {
        width: var(--xxs);
        height: var(--component-xs);
      }
    }

    &.left &-handle {
      right: 0;
    }

    &.top &-handle {
      bottom: 0;
    }

    &-icon {
      display: grid;
      place-items: center;
      color: var(--secondary);
    }

    &-title {
      display: flex;
      grid-area: title;
      padding-inline: var(--xl);
      font-size: var(--font-xl);
      align-items: center;
    }

    &-close {
      margin-left: auto;
      cursor: pointer;
    }

    &-content {
      padding-inline: var(--xs);
      color: var(--on-surface-variant);
    }
  }

  @media (width <= 500px) {
    .md-sheet {
      &.left &-wrapper,
      &.right &-wrapper {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 0 !important;
      }

      &-handle {
        display: none;
      }
    }
  }
</style>
