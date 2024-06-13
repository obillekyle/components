<script setup lang="ts">
  import type { BoxProps } from '@/utils/types'
  import { getCSSValue } from '@/utils/css'
  import { computed, ref } from 'vue'

  const box = ref<HTMLElement | null>(null)
  const props = defineProps<
    BoxProps & {
      exclude?: boolean
    }
  >()

  defineOptions({
    name: 'MdBox'
  })

  const styles = computed(() => {
    const styleObj = {} as any

    if (props.p) styleObj.padding = getCSSValue(props.p)
    if (props.m) styleObj.margin = getCSSValue(props.m)
    if (props.r) styleObj.borderRadius = getCSSValue(props.r)
    if (props.px) styleObj.paddingLeft = getCSSValue(props.px)
    if (props.py) styleObj.paddingTop = getCSSValue(props.py)
    if (props.pt) styleObj.paddingTop = getCSSValue(props.pt)
    if (props.pl) styleObj.paddingLeft = getCSSValue(props.pl)
    if (props.pr) styleObj.paddingRight = getCSSValue(props.pr)
    if (props.pb) styleObj.paddingBottom = getCSSValue(props.pb)
    if (props.mx) styleObj.marginLeft = getCSSValue(props.mx)
    if (props.my) styleObj.marginTop = getCSSValue(props.my)
    if (props.mt) styleObj.marginTop = getCSSValue(props.mt)
    if (props.ml) styleObj.marginLeft = getCSSValue(props.ml)
    if (props.mr) styleObj.marginRight = getCSSValue(props.mr)
    if (props.mb) styleObj.marginBottom = getCSSValue(props.mb)
    if (props.width) styleObj.width = getCSSValue(props.width)
    if (props.height) styleObj.height = getCSSValue(props.height)

    return styleObj
  })

  const mdBox = computed(() => {
    if (props.exclude) return null
    return props.bg ? props.bg : ''
  })
</script>

<template>
  <component :md-box :is="as ?? 'div'" :style="styles" ref="box">
    <slot />
  </component>
</template>

<style lang="scss">
  [md-box] {
    background-color: var(--bgc);
    color: var(--onbgc);

    [md-box='primary'] {
      --bgc: var(--primary);
      --onbgc: var(--on-primary);
    }

    [md-box='secondary'] {
      --bgc: var(--secondary);
      --onbgc: var(--on-secondary);
    }

    [md-box='error'] {
      --bgc: var(--error);
      --onbgc: var(--on-error);
    }

    [md-box='mono'] {
      --bgc: var(--mono-10);
      --onbgc: var(--mono-80);
    }

    [md-box='on-bg'] {
      background-color: var(--onbgc);
      color: var(--bgc);
    }
  }
</style>
