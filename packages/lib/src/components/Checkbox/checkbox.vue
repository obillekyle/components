<script setup lang="ts">
  import { keyClick } from '@/utils/dom/events'
  import { rippleEffect } from '@/utils/dom/ripple'
  import { computed, ref } from 'vue'

  interface CheckboxProps {
    defaultChecked?: boolean
    checked?: boolean
    disabled?: boolean
  }

  interface CheckboxEmits {
    (e: 'checked', value: boolean): void
  }

  const props = withDefaults(defineProps<CheckboxProps>(), {
    checked: undefined,
    disabled: undefined
  })

  const root = ref<HTMLElement>()
  const emit = defineEmits<CheckboxEmits>()
  const model = defineModel<boolean>({ default: undefined })
  defineOptions({ name: 'MdCheckbox', inheritAttrs: false })

  const checked = computed({
    get: () => props.checked ?? model.value ?? props.defaultChecked,
    set: (value) => {
      if (props.disabled) return
      model.value = value
      emit('checked', value)
    }
  })
</script>

<template>
  <div
    class="md-checkbox"
    @click="checked = !checked"
    @pointerdown="rippleEffect"
    @keydown="keyClick"
  >
    <div class="md-checkbox-wrapper">
      <svg
        width="12"
        height="10"
        viewBox="0 0 12 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0.699219 4.69922L4 8L11.3008 0.699219" stroke-width="2" />
      </svg>
      <input
        type="checkbox"
        v-model="checked"
        v-bind="$attrs"
        ref="root"
        :disabled
      />
    </div>
  </div>
</template>

<style lang="scss">
  .md-checkbox {
    display: grid;
    overflow: hidden;
    position: relative;
    place-items: center;
    width: var(--component-sm);
    height: var(--component-sm);
    border-radius: 999px;

    &-wrapper {
      display: grid;
      place-items: center;
      aspect-ratio: 1;
      width: calc(var(--icon-xxl) / 2);
      box-shadow: 0 0 0 2px inset var(--outline);
      border-radius: calc(var(--icon-xxl) / 18);
      transition: all 0.2s;
    }

    path {
      stroke-dasharray: 24;
      stroke-dashoffset: 24;
      stroke: var(--on-primary);
    }

    &:has(input:checked) {
      .md-checkbox-wrapper {
        background: var(--primary);
        box-shadow: none;
      }

      path {
        animation: draw-checkmark 0.5s var(--timing-standard) forwards;
      }
    }

    &:has(input:disabled) {
      filter: grayscale(1);
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }

    input {
      display: none;
    }

    &:not(:has(input:disabled)) {
      cursor: pointer;

      &:hover {
        background: var(--surface-container);
      }
    }
  }

  @keyframes draw-checkmark {
    to {
      stroke-dashoffset: 0; /* Fully visible */
    }
  }
</style>
