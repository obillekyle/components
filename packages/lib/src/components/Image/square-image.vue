<script setup lang="ts">
  import type { Component, HTMLAttributes } from 'vue'
  import type { BoxProps } from '../Box/util'

  import { clean } from '@/utils/object/data'
  import { as } from '@/utils/object/is'
  import { hashStr } from '@/utils/string/hash'
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import { getBoxProps } from '../Box/util'
  import { resolveImage } from './util'

  import Box from '../Box/box.vue'
  import ViewObserver from '../Misc/view-observer.vue'
  import DefaultLoader from './default-loader.vue'

  interface SquareImageProps
    extends BoxProps,
      /* @vue-ignore */ HTMLAttributes {
    src?: string | Blob
    size?: number | string
    frame?: 'default' | 'clover' | 'circle' | 'hexagon'
    lazy?: boolean
    loader?: Component
  }

  const props = withDefaults(defineProps<SquareImageProps>(), {
    frame: 'default',
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
    () => 'img-' + hashStr(String(props.src) + props.frame, 6)
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
    class="md-square-image"
    :class="{ loaded: image, [frame]: true, error }"
    :title="as<string>($attrs['alt'])"
  >
    <div class="md-loader">
      <loader
        :ready="!image"
        :error="error"
        :progress="progress"
        @retry="resolve"
      />
    </div>
    <img
      class="md-image"
      v-bind="$attrs"
      :src="image"
      :width="size"
      :height="size"
      :class="{ hidden: frame !== 'default' }"
      :style="{ objectFit: 'cover' }"
    />

    <svg
      :width="size"
      :height="size"
      class="md-image"
      viewBox="0 0 48 48"
      v-if="frame !== 'default'"
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
          :width="size"
          :height="size"
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
      <path
        v-if="frame === 'circle'"
        d="M22.545.806a3 3 0 0 1 2.91 0l1.496.83a3 3 0 0 0 1.924.34l1.69-.268a3 3 0 0 1 2.735.995l1.122 1.291a3 3 0 0 0 1.692.977l1.68.327a3 3 0 0 1 2.229 1.87l.613 1.597a3 3 0 0 0 1.256 1.497l1.467.881a3 3 0 0 1 1.454 2.52l.03 1.711a3 3 0 0 0 .668 1.836l1.078 1.33a3 3 0 0 1 .505 2.865l-.558 1.618a3 3 0 0 0 0 1.954l.558 1.618a3 3 0 0 1-.505 2.865l-1.078 1.33a3 3 0 0 0-.668 1.836l-.03 1.711a3 3 0 0 1-1.454 2.52l-1.467.88a3 3 0 0 0-1.256 1.497l-.613 1.598a3 3 0 0 1-2.229 1.87l-1.68.327a3 3 0 0 0-1.692.977L33.3 45.297a3 3 0 0 1-2.734.995l-1.69-.267a3 3 0 0 0-1.925.339l-1.496.83a3 3 0 0 1-2.91 0l-1.496-.83a3 3 0 0 0-1.924-.34l-1.69.268a3 3 0 0 1-2.735-.995l-1.122-1.291a3 3 0 0 0-1.692-.977l-1.68-.327a3 3 0 0 1-2.229-1.87l-.613-1.598a3 3 0 0 0-1.256-1.496l-1.467-.882a3 3 0 0 1-1.454-2.519l-.03-1.711a3 3 0 0 0-.668-1.836L1.41 29.46a3 3 0 0 1-.505-2.865l.558-1.618a3 3 0 0 0 0-1.954l-.558-1.618a3 3 0 0 1 .505-2.865l1.078-1.33a3 3 0 0 0 .668-1.836l.03-1.711a3 3 0 0 1 1.454-2.52l1.467-.88a3 3 0 0 0 1.256-1.498l.613-1.597a3 3 0 0 1 2.229-1.87l1.68-.327a3 3 0 0 0 1.692-.977L14.7 2.703a3 3 0 0 1 2.734-.995l1.69.268a3 3 0 0 0 1.925-.34z"
        :fill="`url(#${id})`"
      />
      <path
        v-else-if="frame === 'hexagon'"
        d="M19.435 1.698a9.3 9.3 0 0 1 9.13 0l12.87 7.279C44.26 10.574 46 13.527 46 16.72v14.56c0 3.195-1.74 6.147-4.565 7.744l-12.87 7.279a9.3 9.3 0 0 1-9.13 0l-12.87-7.279C3.74 37.426 2 34.473 2 31.28V16.72c0-3.195 1.74-6.147 4.565-7.744z"
        :fill="`url(#${id})`"
      />
      <path
        v-else
        d="M3.009 17.893C-3.802 8.103 8.103-3.802 17.893 3.01a10.69 10.69 0 0 0 12.214 0c9.79-6.811 21.695 5.094 14.885 14.884a10.69 10.69 0 0 0 0 12.214c6.81 9.79-5.095 21.695-14.885 14.885a10.69 10.69 0 0 0-12.214 0c-9.79 6.81-21.695-5.095-14.884-14.885a10.69 10.69 0 0 0 0-12.214"
        :fill="`url(#${id})`"
      />
    </svg>
  </ViewObserver>
</template>

<style lang="scss">
  .md-square-image {
    position: relative;
    display: inline-flex;
    height: max-content;
    width: max-content;
    vertical-align: top;
    max-width: 100%;
    aspect-ratio: 1;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;

    &.default {
      background: var(--surface-container);
    }

    img {
      border-radius: inherit;
    }

    .hidden {
      width: 100%;
      height: 100%;
      opacity: 0 !important;
      position: absolute;
    }

    .md-loader {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      opacity: 1;
      transition: opacity 0.2s ease-out;

      svg {
        margin-top: -4px;
      }
    }

    svg.md-image {
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

    &.error img {
      pointer-events: none;
    }

    &.loaded {
      background: none;

      .md-loader {
        opacity: 0;
        pointer-events: none;
      }

      image,
      img {
        opacity: 1;
      }
    }

    &.circle.visible .md-image {
      image {
        animation: rotate-image 30s linear infinite reverse;
      }

      path {
        animation: rotate-image 30s linear infinite;
      }

      path,
      image {
        transform-origin: center center;
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
