<script setup lang="ts">
  import type { InputHTMLAttributes } from 'vue'

  import { useBoolValue } from '@/ref/use-form-value'

  import Action from '../Misc/action.vue'

  interface Props {
    inputAttrs?: InputHTMLAttributes
    defaultChecked?: boolean
    partial?: boolean
    checked?: boolean
    name?: string
  }

  interface CheckboxEmits {
    (e: 'checked', value: boolean): void
  }

  const emits = defineEmits<CheckboxEmits>()
  const props = withDefaults(defineProps<Props>(), { checked: undefined })
  const model = defineModel<boolean>({ default: undefined })
  const checked = useBoolValue(false, props, model, (v) =>
    emits('checked', v)
  )

  defineOptions({ name: 'MdCheckbox' })
</script>

<template>
  <Action
    class="md-checkbox"
    @click="checked = !checked"
    :checked="checked || undefined"
  >
    <div class="md-checkbox-wrapper">
      <svg
        width="12"
        height="10"
        viewBox="0 0 12 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1 4.5H11" v-if="partial" />
        <path d="M0.699219 4.69922L4 8L11.3008 0.699219" v-else />
      </svg>
      <input
        v-bind="inputAttrs"
        :name
        type="checkbox"
        v-model="checked"
        hidden
      />
    </div>
  </Action>
</template>

<style lang="scss">
  .md-checkbox {
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
      stroke-width: 2px;
      stroke-dasharray: 24;
      stroke-dashoffset: 24;
      stroke: var(--on-primary);
    }

    &[checked] {
      .md-checkbox-wrapper {
        background: var(--primary);
        box-shadow: none;
      }

      path {
        animation: draw-checkmark 0.5s var(--timing-standard) forwards;
      }
    }
  }

  @keyframes draw-checkmark {
    to {
      stroke-dashoffset: 0;
    }
  }
</style>
