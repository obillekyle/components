<script setup lang="ts">
  import '@/assets/image.scss'

  import type { Component, HTMLAttributes } from 'vue'
  import type { BoxProps } from '../Box/util'
  import type { FrameVariants } from '../Frame/variants'

  import { clean } from '@/utils/object/data'
  import { as } from '@/utils/object/is'
  import { hashStr } from '@/utils/string/hash'
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import { getBoxProps } from '../Box/util'
  import { frames } from '../Frame/variants'
  import { resolveImage } from './util'

  import Box from '../Box/box.vue'
  import ViewObserver from '../Misc/view-observer.vue'
  import DefaultLoader from './default-loader.vue'

  interface SquareImageProps
    extends BoxProps,
      /* @vue-ignore */ HTMLAttributes {
    src?: string | Blob
    size?: number | string
    frame?: FrameVariants | 'none'
    lazy?: boolean
    loader?: Component
  }

  const props = withDefaults(defineProps<SquareImageProps>(), {
    frame: 'none',
    size: 96,
    loader: DefaultLoader
  })

  const boxProps = getBoxProps(props, {
    width: props.size,
    height: props.size,
    r: '#xs'
  })

  const progress = ref(0)
  const image = ref<string>()
  const error = ref(false)
  const visible = ref(false)
  const id = computed(
    () => 'img-' + hashStr(String(props.src) + image.value, 6)
  )

  async function resolve() {
    error.value = false
    let source = props.src

    if (image.value) {
      clean(image.value)
      image.value = undefined
    }

    if (!source) {
      error.value = true
      return
    }

    source =
      source instanceof Blob
        ? URL.createObjectURL(source)
        : source.replaceAll('[size]', String(props.size))

    try {
      const data = await resolveImage(source, (v) => (progress.value = v))
      image.value = URL.createObjectURL(data)
    } catch (error_) {
      console.warn(error_)
      error.value = true
    }
  }

  watch(visible, (v) => {
    if (!props.lazy) return
    if (v && !progress.value && !image.value && !error.value) {
      resolve()
    }
  })

  watch(() => props.src, resolve)
  onMounted(() => !props.lazy && resolve())
  onUnmounted(() => clean(image.value))
</script>

<template>
  <ViewObserver
    :as="Box"
    :offset="50"
    apply="visible"
    v-bind="boxProps"
    v-model="visible"
    class="md-square-image md-image"
    :class="{ loaded: image, [frame]: true, error }"
    :title="as<string>($attrs['alt'])"
  >
    <component
      class="md-loader"
      :is="loader"
      :error
      :progress
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

    &.default {
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
