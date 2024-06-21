<script setup lang="ts">
  import type { BoxProps } from '@/components/Box'
  import type { HTMLAttributes } from 'vue'

  import Box, { getBoxProps } from '@/components/Box'
  import CircularProgress from '../Progress/circular-progress.vue'
  import { computed, onBeforeMount, onUnmounted, ref, watch } from 'vue'
  import { Icon } from '@iconify/vue'

  interface BlockImageProps
    extends BoxProps,
      /** @vue-ignore */ HTMLAttributes {
    src?: string | Blob
    alt?: string
    fit?: 'contain' | 'cover'
    position?: 'left' | 'center' | 'right'
    ratio?: number
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
  const boxProps = computed(() => getBoxProps(props))

  async function resolve() {
    error.value = false
    let data: Blob | undefined
    if (image.value) {
      URL.revokeObjectURL(image.value)
      image.value = ''
    }

    if (typeof props.src === 'string') {
      progress.value = Infinity
      const url = props.src
        .replace(/\[width\]/g, props.width?.toString() || '')
        .replace(/\[height\]/g, props.height?.toString() || '')
      const xhr = new XMLHttpRequest()
      xhr.responseType = 'arraybuffer'
      xhr.open('GET', url)
      xhr.onprogress = (e) => {
        progress.value = !e.total
          ? Infinity
          : Math.floor((e.loaded / e.total) * 100)
      }
      xhr.send()
      data = await new Promise((resolve) => {
        xhr.onload = () =>
          resolve(new Blob([xhr.response || ''], { type: 'image/webp' }))
        xhr.onerror = () => resolve(undefined)
      })
    } else {
      data = props.src
    }

    if (!data) {
      error.value = true
      return
    }

    setTimeout(() => {
      image.value = URL.createObjectURL(data)
    }, 200)
  }

  onBeforeMount(() => resolve())
  onUnmounted(() => URL.revokeObjectURL(image.value || ''))
  watch(
    () => props.src,
    () => resolve()
  )

  defineOptions({
    name: 'MdBlockImage'
  })
</script>

<template>
  <Box
    exclude
    v-bind="boxProps"
    class="md-block-image"
    :class="{ loaded: image, 'image-error': error, span }"
  >
    <Box class="md-loader">
      <CircularProgress :value="error ? 0 : progress">
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
  </Box>
</template>

<style scoped lang="scss">
  .md-block-image {
    position: relative;
    overflow: hidden;
    width: max-content;
    height: max-content;
    aspect-ratio: v-bind('props.ratio');

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
      width: 100%;
      flex-grow: 1;
      height: auto;

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
