<script setup lang="ts">
  import type { UtilityFunction } from '@/utils/component-manager'
  import type { SnackbarProps } from './util'

  import { Icon } from '@iconify/vue'
  import { computed, onMounted, watch } from 'vue'
  import { SNACKBAR } from './util'

  import Box from '../Box/box.vue'
  import Button from '../Button/button.vue'
  import Text from '../Text/text.vue'

  interface SnackbarOptions extends SnackbarProps {
    utils?: UtilityFunction<SnackbarProps>
  }

  defineOptions({ name: 'MdSnackbar' })
  const props = defineProps<SnackbarOptions>()
  const utils = computed(() => props.utils ?? SNACKBAR.DEFAULT_UTILITY)

  let timeout: any

  function startTimeout(time: number = props.timeout ?? Infinity) {
    timeout && clearTimeout(timeout)
    if (Number.isFinite(time)) {
      timeout = setTimeout(() => utils.value.close(), props.timeout)
    }
  }

  onMounted(startTimeout)
  watch(() => props.timeout, startTimeout)
</script>

<template>
  <Box
    class="md-snackbar"
    :class="{
      static: !Number.isFinite(utils.id),
      extended: actions?.length
    }"
  >
    <Text class="md-snackbar-content" lines="3" as="span">
      <template v-if="typeof message == 'string'">{{ message }}</template>
      <component v-else :is="message ?? 'span'" />
      <slot />
    </Text>

    <div class="md-snackbar-actions" v-if="actions || closeable">
      <template v-for="(action, index) in actions" :key="index">
        <Button
          v-if="'onClick' in action"
          @click="action.onClick(utils)"
          :label="action.label"
          variant="text"
        />
        <component v-else :is="action" />
      </template>
    </div>
    <Icon
      icon="material-symbols:close"
      v-if="closeable"
      class="md-snackbar-close"
      @click="utils.close"
      :width="24"
      :inline="false"
    />
  </Box>
</template>

<style lang="scss">
  .md-snackbar {
    gap: var(--sm);
    width: auto;
    max-width: 600px;
    border-radius: var(--xxs);
    background: var(--on-surface);
    color: var(--surface);
    min-height: var(--component-md);
    padding: var(--sm);
    box-shadow: 0 0 0 1px var(--surface-variant);
    display: flex;
    align-items: center;

    &:not(.static) {
      position: fixed;
      z-index: 20;
      right: var(--md);
      bottom: var(--sm);
      width: calc(100% - (var(--md) * 2));
    }

    &-content {
      flex: 1 1 auto;
      font-size: var(--font-sm);
      padding-inline: var(--xxs);
      grid-area: content;
    }

    &-actions {
      display: flex;
      align-items: center;
      grid-area: actions;

      * {
        font-size: var(--font-sm);
        color: var(--inverse-primary);
      }
    }

    &-enter-active,
    &-leave-active {
      transition:
        opacity 0.3s var(--timing-standard),
        transform 0.3s var(--timing-standard);
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
      transform: translateY(var(--xl));
    }

    &-close {
      grid-area: icon;
      flex-shrink: 0;
      cursor: pointer;
    }

    &.extended {
      display: grid;
      grid-template:
        'content icon' auto
        'actions actions' auto / 1fr auto;
    }

    &.extended &-close {
      align-self: start;
    }

    &.extended &-actions {
      margin-left: auto;
    }
  }
</style>
