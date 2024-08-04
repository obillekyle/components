<script setup lang="ts">
  import type { BoxProps } from '@/components/Box/util'
  import type { HTMLAttributes } from 'vue'

  import Box from '@/components/Box/box.vue'
  import { getBoxProps } from '@/components/Box/util'
  import { Icon } from '@iconify/vue'
  import { onMounted, onUnmounted, ref, watch } from 'vue'
  import ViewObserver from '../Misc/view-observer.vue'
  import CircularProgress from '../Progress/circular-progress.vue'
  import { resolveImage } from './util'

  interface BlockImageProperties
    extends BoxProps,
      /** @vue-ignore */ HTMLAttributes {
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
  }

  const props = withDefaults(defineProps<BlockImageProperties>(), {
    fit: 'cover',
    position: 'center',
    cover: false
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
      URL.revokeObjectURL(image.value)
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
      setTimeout(() => (image.value = URL.createObjectURL(data)), 200)
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
  onUnmounted(() => URL.revokeObjectURL(image.value || ''))

  defineOptions({ name: 'MdBlockImage' })
</script>

<template>
  <ViewObserver
    :as="Box"
    :offset="50"
    v-bind="boxProps"
    class="md-block-image"
    :change="(v) => (visible = v)"
    :class="{ loaded: image, 'image-error': error, span }"
  >
    <Box class="md-loader">
      <CircularProgress :value="error ? 0 : progress" rotate>
        <Icon
          icon="material-symbols:refresh"
          :width="24"
          v-if="error"
          @click="resolve"
          style="cursor: pointer"
          color="var(--error, red)"
        />
      </CircularProgress>
    </Box>
    <img v-if="!error" :src="image" :alt :width :height />
  </ViewObserver>
</template>

<style lang="scss">
  .md-block-image {
    position: relative;
    overflow: hidden;
    width: max-content;
    height: max-content;
    border-radius: var(--sm);
    aspect-ratio: v-bind('props.ratio');
    background: var(--surface-container);

    .md-fade-enter-active {
      opacity: 1;
    }

    .md-fade-leave-active {
      opacity: 0;
    }

    img {
      display: block;
      opacity: 0;
      border-radius: inherit;
      object-fit: v-bind('props.fit');
      object-position: v-bind('props.position');
      transition: opacity 0.2s ease-out;
    }

    .md-loader {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      transition: opacity 0.2s ease-out;
    }

    &.span {
      flex-grow: 1;
      width: 100% !important;
      height: auto !important;

      img {
        width: 100%;
        height: 100%;
      }
    }

    &.image-error {
      .md-loader {
        .md-circular-progress-content {
          bottom: 8px !important;
        }
      }
    }

    &.loaded {
      background: none;

      .md-loader {
        opacity: 0;
        pointer-events: none;
      }

      img {
        opacity: 1;
      }
    }
  }
</style>
