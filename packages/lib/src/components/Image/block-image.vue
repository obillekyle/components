<script setup lang="ts">
  import type { BoxProps } from '@/components/Box/util'
  import type { HTMLAttributes } from 'vue'

  import Box from '@/components/Box/box.vue'
  import { getBoxProps } from '@/components/Box/util'
  import CircularProgress from '../Progress/circular-progress.vue'
  import { computed, onUnmounted, ref, watch, onMounted } from 'vue'
  import { Icon } from '@iconify/vue'
  import { resolveImage } from './util'
  import ViewObserver from '../Misc/view-observer.vue'

  interface BlockImageProps
    extends BoxProps,
      /** @vue-ignore */ HTMLAttributes {
    src?: string | Blob
    alt?: string
    fit?: 'contain' | 'cover'
    position?: 'left' | 'center' | 'right'
    ratio?: number
    lazy?: boolean
    cover?: boolean
    width?: number
    height?: number
    span?: boolean
  }

  const props = withDefaults(defineProps<BlockImageProps>(), {
    size: 'md',
    fit: 'cover',
    position: 'center',
    cover: false,
    r: 'sm'
  })

  const progress = ref(0)
  const image = ref<string>()
  const error = ref(false)
  const visible = ref(false)
  const boxProps = computed(() => getBoxProps(props))

  async function resolve() {
    error.value = false
    let src = props.src

    if (image.value) {
      URL.revokeObjectURL(image.value)
      image.value = undefined
    }

    if (!src) {
      error.value = true
      return
    }

    src =
      src instanceof Blob
        ? URL.createObjectURL(src)
        : src
            .replace(/\[width\]/g, String(props.width))
            .replace(/\[height\]/g, String(props.height))

    try {
      const data = await resolveImage(src, (e) => (progress.value = e))
      setTimeout(() => (image.value = URL.createObjectURL(data)), 200)
    } catch (e) {
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
    exclude
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
          color="red"
          v-if="error"
          @click="resolve"
          style="cursor: pointer"
        />
      </CircularProgress>
    </Box>
    <img v-if="!error" :src="image" :alt :width :height />
  </ViewObserver>
</template>

<style lang="scss" scoped>
  .md-block-image {
    position: relative;
    overflow: hidden;
    width: max-content;
    height: max-content;
    aspect-ratio: v-bind('props.ratio');
    background-color: var(--mono-10);

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
