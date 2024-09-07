<script setup lang="ts">
  import '@/assets/image.scss'

  import type { Component } from 'vue'
  import type { BoxProps } from '../Box/util'
  import type { FrameVariants } from '../Frame/variants'
  import type { Status } from './util'

  import { clean } from '@/utils/object/data'
  import { as } from '@/utils/object/is'
  import {
    computed,
    onMounted,
    onUnmounted,
    ref,
    shallowReactive,
    watch
  } from 'vue'
  import { getBoxProps } from '../Box/util'
  import { frames } from '../Frame/variants'
  import { getData } from './util'

  import { hashStr } from '@/utils'
  import Box from '../Box/box.vue'
  import ViewObserver from '../Misc/view-observer.vue'
  import DefaultLoader from './default-loader.vue'

  interface SquareImageProps extends BoxProps {
    src?: string
    size?: number
    frame?: FrameVariants | 'none'
    lazy?: boolean
    loader?: Component
  }

  const props = withDefaults(defineProps<SquareImageProps>(), {
    frame: 'none',
    size: 96,
    loader: DefaultLoader
  })

  const boxProps = getBoxProps(props)

  const image = ref<string>('')
  const status = shallowReactive<Status>({
    progress: 0,
    error: false,
    visible: false
  })

  const id = computed(() =>
    image.value ? 'md-image-' + hashStr(image.value) : undefined
  )

  function resolve() {
    if (!props.src) return
    getData(
      {
        src: props.src,
        size: props.size
      },
      image,
      status
    )
  }

  watch(
    () => status.visible,
    (visible) => {
      if (!visible || !props.lazy) return
      if (status.progress || status.error || image.value) return
      resolve()
    }
  )

  watch(() => props.src, resolve)
  onMounted(() => !props.lazy && resolve())
  onUnmounted(() => clean(image.value))
</script>

<template>
  <ViewObserver
    :as="Box"
    :offset="50"
    :width="size"
    :height="size"
    v-bind="boxProps"
    apply="visible"
    class="md-square-image md-image"
    @viewchange="status.visible = $event"
    :class="{ loaded: image, [frame]: true, error: status.error }"
    :title="as<string>($attrs['alt'])"
  >
    <component
      class="md-loader"
      :is="loader"
      :error="status.error"
      :progress="status.progress"
      :ready="!!image"
      @retry="resolve"
    />
    <img
      class="md-image-element"
      v-bind="$attrs"
      :src="image"
      :width="size"
      :height="size"
      :class="{ hidden: frame in frames }"
      :style="{ objectFit: 'cover' }"
    />

    <svg
      :width="size"
      :height="size"
      class="md-image-element"
      viewBox="0 0 48 48"
      v-if="frame in frames"
      xmlns="http://www.w3.org/2000/svg"
    >
      <pattern
        :id
        :width="size"
        :height="size"
        patternUnits="userSpaceOnUse"
      >
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="var(--surface-container)"
        />
        <image
          :href="image"
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMinYMin slice"
        />
      </pattern>
      <path :d="frames[frame as FrameVariants]" :fill="`url(#${id})`" />
    </svg>
  </ViewObserver>
</template>

<style lang="scss">
  .md-square-image {
    position: relative;
    display: inline-flex;
    vertical-align: top;
    max-width: 100%;
    aspect-ratio: 1;
    justify-content: center;
    align-items: center;

    &.none {
      border-radius: var(--xs);
      background: var(--surface-container);
    }

    .hidden {
      width: 100%;
      height: 100%;
      opacity: 0 !important;
      position: absolute;
    }

    svg.md-image-element {
      width: 100%;
      height: 100%;
      aspect-ratio: 1;
    }

    image,
    img {
      opacity: 0;
      transition: opacity 0.2s ease-out;
      width: 100%;
      aspect-ratio: 1;
    }

    &.circle.visible .md-image-element {
      path,
      image {
        animation: rotate-image 30s linear infinite;
        transform-origin: center center;
      }

      image {
        animation-direction: reverse;
      }
    }

    @keyframes rotate-image {
      from {
        rotate: 0;
      }

      to {
        rotate: 360deg;
      }
    }
  }
</style>
