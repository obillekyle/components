<script setup lang="ts">
  import '@/assets/image.scss'

  import type { BoxProps } from '@/components/Box/util'
  import type { Component } from 'vue'

  import { getBoxProps } from '@/components/Box/util'
  import { clean } from '@/utils/object/data'
  import { onMounted, onUnmounted, ref, watch } from 'vue'
  import { resolveImage } from './util'

  import Box from '@/components/Box/box.vue'
  import ViewObserver from '../Misc/view-observer.vue'
  import DefaultLoader from './default-loader.vue'

  interface BlockImageProps extends BoxProps {
    src?: string | Blob
    alt?: string
    fit?: 'contain' | 'cover' | 'fill'
    position?: 'left' | 'center' | 'right' | 'top' | 'bottom'
    ratio?: number
    lazy?: boolean
    cover?: boolean
    width?: number
    height?: number
    span?: boolean
    loader?: Component
  }

  const props = withDefaults(defineProps<BlockImageProps>(), {
    fit: 'cover',
    position: 'center',
    cover: false,
    loader: DefaultLoader
  })

  const progress = ref(0)
  const image = ref<string>()
  const error = ref(false)
  const visible = ref(false)
  const boxProps = getBoxProps(props)

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
        : source
            .replaceAll('[width]', String(props.width))
            .replaceAll('[height]', String(props.height))

    try {
      const data = await resolveImage(source, (e) => (progress.value = e))
      image.value = URL.createObjectURL(data)
    } catch {
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

  defineOptions({ name: 'MdBlockImage' })
</script>

<template>
  <ViewObserver
    :as="Box"
    :offset="50"
    v-model="visible"
    v-bind="boxProps"
    class="md-block-image md-image"
    :class="{ loaded: image, 'image-error': error, span }"
  >
    <div class="md-loader">
      <component
        :is="loader"
        :error
        :progress
        :ready="!!image"
        @retry="resolve"
      />
    </div>
    <img
      class="md-image-element"
      v-if="!error"
      :src="image"
      :alt
      :width
      :height
    />
  </ViewObserver>
</template>

<style lang="scss">
  .md-block-image {
    overflow: hidden;
    border-radius: var(--sm);
    aspect-ratio: v-bind('props.ratio');
    background: var(--surface-container);

    img {
      display: block;
      opacity: 0;
      object-fit: v-bind('props.fit');
      object-position: v-bind('props.position');
      transition: opacity 0.2s ease-out;
    }
  }
</style>
