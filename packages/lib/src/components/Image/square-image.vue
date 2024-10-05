<script setup lang="ts">
  import '@/assets/image.scss'

  import type { Component } from 'vue'
  import type { BoxProps } from '../Box/util'
  import type { FrameVariants } from '../Frame/variants'
  import type { Status } from './util'

  import { clean } from '@/utils/object/data'
  import { createStyle } from '@/utils/css/create-style'
  import { onMounted, onUnmounted, ref, shallowReactive, watch } from 'vue'
  import { frames } from '../Frame/variants'
  import { toSvgMask } from '../Frame/util'
  import { getData } from './util'

  import ViewObserver from '../Misc/view-observer.vue'
  import DefaultLoader from './default-loader.vue'
  import Box from '../Box/box.vue'

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

  const image = ref('')
  const status = shallowReactive<Status>({
    progress: 0,
    error: false,
    visible: false
  })

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

  const className = createStyle(() => ({
    r: '#xs',
    width: props.size,
    height: props.size,
    maskImage:
      props.frame in frames
        ? toSvgMask(48, (frames as any)[props.frame])
        : 'none'
  }))

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
    offset="50"
    apply="visible"
    class="md-square-image md-image"
    :class="className"
    :loading="!image || undefined"
    :error="status.error || undefined"
    @viewchange="status.visible = $event"
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
    />
  </ViewObserver>
</template>

<style lang="scss">
  .md-square-image {
    display: inline-flex;
    vertical-align: top;
    max-width: 100%;
    aspect-ratio: 1;
    justify-content: center;
    align-items: center;
    background: var(--surface-container);

    &.none {
      border-radius: var(--xs);
    }

    img {
      transition: opacity 0.2s ease-out;
      object-fit: cover;
      width: 100%;
      aspect-ratio: 1;
    }
  }
</style>
