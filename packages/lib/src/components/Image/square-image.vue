<script setup lang="ts">
  import '@/assets/image.scss'

  import type { Component } from 'vue'
  import type { BoxProps } from '../Box/util'
  import type { FrameVariants } from '../Frame/variants'

  import { createStyle } from '@/utils/create-style'
  import { ref, watch } from 'vue'
  import { frames } from '../Frame/variants'
  import { toSvgMask } from '../Frame/util'
  import { useFetch } from '@/ref/use-fetch'

  import ViewObserver from '../Misc/view-observer.vue'
  import DefaultLoader from './default-loader.vue'
  import Box from '../Box/box.vue'
  import { getSrc } from './util'

  interface SquareImageProps /* @vue-ignore */ extends BoxProps {
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

  const visible = ref(false)
  const fetch = useFetch(() => getSrc(props), 'url-blob', { init: false })

  const className = createStyle(() => ({
    width: props.size,
    height: props.size,
    maskImage:
      props.frame in frames
        ? toSvgMask(48, (frames as any)[props.frame])
        : 'none'
  }))

  watch(
    visible,
    (visible) => {
      if (fetch.ready || fetch.loading || fetch.error) return
      if (!props.lazy || visible) fetch.refetch()
    },
    { immediate: true }
  )
</script>

<template>
  <ViewObserver
    :as="Box"
    offset="50"
    apply="visible"
    class="md-square-image md-image"
    :class="className"
    :loading="!fetch.data || undefined"
    :error="fetch.error || undefined"
    v-model="visible"
  >
    <component
      class="md-loader"
      :is="loader"
      :error="fetch.error"
      :progress="fetch.progress"
      :ready="fetch.ready"
      @retry="fetch.refetch"
    />
    <img
      class="md-image-element"
      v-bind="$attrs"
      :src="fetch.data"
      :width="size"
      :height="size"
    />
  </ViewObserver>
</template>

<style lang="scss">
  .md-square-image {
    display: inline-flex;
    vertical-align: top;
    max-width: 100%;
    aspect-ratio: 1;
    align-items: center;
    justify-content: center;
    border-radius: var(--xs);
    background: var(--surface-container);

    img {
      transition: opacity 0.2s ease-out;
      object-fit: cover;
      width: 100%;
      aspect-ratio: 1;
    }
  }
</style>
