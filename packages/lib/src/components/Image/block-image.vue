<script setup lang="ts">
  import '@/assets/image.scss'

  import type { BoxProps } from '@/components/Box/util'
  import type { Component } from 'vue'

  import { useFetch } from '@/ref/use-fetch'
  import { ref, watch } from 'vue'
  import { getSrc } from './util'

  import Box from '../Box/box.vue'
  import ViewObserver from '../Misc/view-observer.vue'
  import DefaultLoader from './default-loader.vue'

  interface BlockImageProps extends /* @vue-ignore */ BoxProps {
    src?: string
    alt?: string
    fit?: 'contain' | 'cover' | 'fill'
    position?: 'left' | 'center' | 'right' | 'top' | 'bottom'
    ratio?: number
    lazy?: boolean
    cover?: boolean
    width?: number
    height?: number
    loader?: Component
  }

  const props = withDefaults(defineProps<BlockImageProps>(), {
    fit: 'cover',
    position: 'center',
    cover: false,
    loader: DefaultLoader
  })

  const visible = ref(false)
  const fetch = useFetch(() => getSrc(props), 'url-blob', { init: false })

  watch(
    visible,
    (visible) => {
      if (fetch.ready || fetch.loading || fetch.error) return
      if (!props.lazy || visible) fetch.refetch()
    },
    { immediate: true }
  )

  defineOptions({ name: 'MdBlockImage' })
</script>

<template>
  <ViewObserver
    :as="Box"
    offset="50"
    class="md-block-image md-image"
    :loading="fetch.loading || undefined"
    :error="fetch.error || undefined"
    v-model="visible"
  >
    <div class="md-loader">
      <component
        :is="loader"
        :error="fetch.error"
        :progress="fetch.progress"
        :ready="fetch.ready"
        @retry="fetch.refetch"
      />
    </div>
    <img
      class="md-image-element"
      v-if="!fetch.error"
      :src="fetch.data"
      :alt
      :width
      :height
    />
  </ViewObserver>
</template>

<style lang="scss">
  .md-block-image {
    border-radius: var(--sm);
    aspect-ratio: v-bind('props.ratio');
    background: var(--surface-container);

    img {
      display: block;
      object-fit: v-bind('props.fit');
      object-position: v-bind('props.position');
      transition: opacity 0.2s ease-out;
    }
  }
</style>
