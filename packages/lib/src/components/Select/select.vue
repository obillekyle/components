<script setup lang="ts">
  import '@/assets/input.scss'

  import type { Component, HTMLAttributes } from 'vue'
  import type { MixedValues } from '@/utils/other/to-object-value'

  import { rippleEffect } from '@/utils/dom/ripple'
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { filterByLabel, toggleItem } from './util'
  import { useValue } from '@/ref/use-form-value'
  import { toObjectValue } from '@/utils/other/to-object-value'

  import OptionItem from './option-item.vue'
  import HybridIcon from '../Misc/hybrid-icon.vue'

  interface SelectProps
    extends /* @vue-ignore */ Omit<HTMLAttributes, 'onChange'> {
    value?: (string | number)[]
    defaultValue?: (string | number)[]
    prefix?: string
    variant?: 'filled' | 'outlined'
    icon?: string | Component
    items?: MixedValues
    multiple?: boolean
    required?: boolean
    placeholder?: string
  }

  type SelectEmits = {
    (e: 'change', value: (string | number)[]): void
  }

  const show = ref(false)
  const root = ref<HTMLElement>()
  const search = ref('')

  const props = defineProps<SelectProps>()
  const emits = defineEmits<SelectEmits>()
  const model = defineModel<(string | number)[]>()
  const values = computed(() => toObjectValue(props.items ?? []))
  const selected = useValue([], props, model, (v) => emits('change', v))

  const filteredItems = computed(() => {
    const query = search.value.toLowerCase()
    return query ? filterByLabel(values.value, query) : values.value
  })

  function getValue(key: string | number) {
    return values.value.find((item) => item.value === key)
  }

  const active = computed(() => {
    const values = selected.value

    return {
      first: getValue(values[0] ?? ''),
      values: values.map((item) => getValue(item)!).filter(Boolean)
    }
  })

  defineOptions({ name: 'MdSelect' })

  function handleClick(value?: string | number) {
    if (value === undefined) {
      if (props.multiple || props.required) return
      selected.value = []
      return
    }

    selected.value = props.multiple
      ? toggleItem(selected.value, value)
      : [value]
  }

  function closeIfClickOutside(event: MouseEvent) {
    if (show.value && !root.value?.contains(event.target as Node)) {
      show.value = false
    }
  }

  const isEmpty = computed(() => {
    if (props.multiple) return search.value.length === 0
    return !active.value.first && !show.value
  })

  onMounted(() => addEventListener('click', closeIfClickOutside))
  onUnmounted(() => removeEventListener('click', closeIfClickOutside))
</script>

<template>
  <div
    ref="root"
    class="md-input"
    type="select"
    :variant="variant ?? 'filled'"
    :empty="isEmpty || undefined"
  >
    <div class="md-input-selected" v-if="multiple">
      <div
        class="md-input-selected-item"
        v-for="item in active.values"
        @click="handleClick(item.value)"
        @pointerdown="rippleEffect"
        :key="item.value"
      >
        <OptionItem v-bind="item" />
        <HybridIcon icon="mdi:close" />
      </div>
    </div>
    <div class="md-input-wrapper" @click="show = !show">
      <HybridIcon class="md-input-icon left" :icon />
      <span class="md-input-placeholder">{{ placeholder }}</span>
      <span class="md-input-prefix" v-if="prefix">{{ prefix }}</span>
      <HybridIcon
        :rotate="show || undefined"
        class="md-input-icon right"
        icon="mdi:chevron-down"
      />

      <template v-if="!multiple">
        <input
          v-if="!active.first"
          class="md-input-field"
          v-model="search"
        />
        <div class="md-input-field md-input-selected-single" v-else>
          <slot v-bind="active.first">
            <OptionItem v-bind="active.first" />
          </slot>
        </div>
      </template>

      <template v-else>
        <input class="md-input-field" v-model="search" />
      </template>

      <div class="md-input-select-dropdown" :visible="show || undefined">
        <div
          v-if="!multiple && !required"
          class="md-input-select-item"
          @click="handleClick()"
          @pointerdown="rippleEffect"
        />
        <div
          class="md-input-select-item"
          v-for="item in filteredItems"
          @click="handleClick(item.value)"
          @pointerdown="rippleEffect"
          :key="item.value"
        >
          <OptionItem v-bind="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .md-input {
    &-select-item {
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      height: var(--component-md);
      padding-inline: var(--md);
    }

    &-icon[rotate] {
      rotate: 180deg;
    }

    &-selected {
      margin-bottom: var(--xs);

      &:empty {
        display: none;
      }

      &-item {
        display: flex;
        overflow: hidden;
        position: relative;
        align-items: center;
        padding-inline: var(--md);
        height: var(--component-md);
      }

      &-single {
        padding-top: var(--md);
      }

      .md-icon {
        margin-left: auto;
      }
    }

    &-select-dropdown {
      z-index: 1;
      position: absolute;
      align-self: last baseline;
      top: 100%;
      width: 100%;
      overflow: auto;
      max-height: 300%;
      background: var(--surface-container-low);
      transition: scale 0.2s var(--timing-standard);
      border-radius: 0 0 var(--xxs) var(--xxs);
      box-shadow: var(--shadow-1);
      transform-origin: top;

      &:not([visible]) {
        scale: 1 0;
      }
    }
  }
</style>
