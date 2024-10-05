<script setup lang="ts">
  import '@/assets/image.scss'

  import type { BoxProps } from '@/components/Box/util'
  import type { Component } from 'vue'
  import type { Status } from './util'

  import { customRef } from '@/ref/custom-ref'
  import { useRect } from '@/ref/use-rect'
  import { clean } from '@/utils/object/data'
  import { assert } from '@/utils/object/is'
  import { onUnmounted, ref, shallowReactive, watch } from 'vue'
  import { getData } from './util'

  import ViewObserver from '../Misc/view-observer.vue'
  import DefaultLoader from './default-loader.vue'
  import Box from '../Box/box.vue'

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

  const [root, setRoot] = customRef<HTMLElement>()
  const rect = useRect(root)

  const props = withDefaults(defineProps<BlockImageProps>(), {
    fit: 'cover',
    position: 'center',
    cover: false,
    loader: DefaultLoader
  })

  const image = ref<string>('')
  const status = shallowReactive<Status>({
    progress: 0,
    error: false,
    visible: false
  })

  function resolve() {
    assert(rect.ready, 'rect must be ready')

    getData(
      {
        src: props.src,
        width: props.width || rect.width,
        height: props.height || rect.height
      },
      image,
      status
    )
  }

  watch(
    () => rect.ready && status.visible,
    (visible) => {
      if (!visible || !props.lazy) return
      if (status.progress || status.error || image.value) return
      resolve()
    }
  )

  watch(() => props.src, resolve)
  watch(
    () => rect.ready,
    () => !props.lazy && resolve()
  )

  onUnmounted(() => clean(image.value))
  defineOptions({ name: 'MdBlockImage' })
</script>

<template>
  <ViewObserver
    :as="Box"
    offset="50"
    class="md-block-image md-image"
    :ref="setRoot"
    :loading="!image || undefined"
    :error="status.error || undefined"
    @viewchange="status.visible = $event"
  >
    <div class="md-loader">
      <component
        :is="loader"
        :error="status.error"
        :progress="status.progress"
        :ready="!!image"
        @retry="resolve"
      />
    </div>
    <img
      class="md-image-element"
      v-if="!status.error"
      :src="image"
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
