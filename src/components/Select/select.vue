<script setup lang="ts">
  import {
    ref,
    type Component,
    type HTMLAttributes,
    computed,
    watch,
    onMounted
  } from 'vue'
  import OptionItem from './option-item.vue'
  import { Icon } from '@iconify/vue'
  import { $, keyboardClick, rippleEffect } from '@/utils/dom'
  import { evaluate } from '@/utils/object'

  export type SelectItem = {
    readonly id: string | number
    readonly name: string
    [key: string]: any
  }

  interface SelectProps extends /* @vue-ignore */ HTMLAttributes {
    value?: number[]
    items?: SelectItem[] | string[]
    optionComp?: Component
    searchByKey?: string[]
    multiple?: boolean
    required?: boolean
    placeholder?: string
    span?: boolean
    change?: (value: number[]) => void
  }

  const values = computed(() => {
    return props.items.map((item) => {
      return typeof item === 'object'
        ? item
        : {
            id: item,
            name: item
          }
    })
  })

  const show = ref(false)
  const search = ref('')
  const select = ref<HTMLElement | null>(null)
  const props = withDefaults(defineProps<SelectProps>(), {
    optionComp: OptionItem,
    searchByKey: () => [],
    multiple: false,
    required: false,
    items: () => [],
    value: () => []
  })

  const modelValue = defineModel<number[]>()

  const items = computed(() => {
    return values.value.filter(
      (item) =>
        item.id.toString().toLowerCase().includes(search.value.toLowerCase()) ||
        props.searchByKey.some((key) =>
          item.props[key]!.toString()
            .toLowerCase()
            .includes(search.value.toLowerCase())
        )
    )
  })

  defineExpose({ items })
  defineOptions({
    name: 'MdSelect'
  })

  const toggle = () => (show.value = !show.value)
  const val = computed(() => modelValue.value || props.value)
  function handleClick(index?: number) {
    if (index === undefined) {
      if (props.multiple || props.required) return
      if (modelValue.value) modelValue.value = []
      evaluate(props.change, [])
      return
    }

    if (modelValue.value) {
      if (props.multiple) {
        modelValue.value = modelValue.value.includes(index)
          ? modelValue.value.filter((i) => i !== index)
          : [...modelValue.value, index]
      } else {
        modelValue.value = [index]
      }
    }

    if (props.multiple) {
      const value = val.value.includes(index)
        ? val.value.filter((i) => i !== index)
        : [...val.value, index]
      evaluate(props.change, value)
    } else {
      evaluate(props.change, [index])
    }
  }

  watch(show, (show) => {
    if (show && select.value) {
      $('.md-select-options-dropdown .md-select-option', select.value)?.focus()
    }
  })

  function closeIfClickOutside(event: MouseEvent) {
    if (show.value && !select.value?.contains(event.target as Node)) {
      show.value = false
    }
  }

  onMounted(() => {
    if (props.value) handleClick(props.value[0])

    document.addEventListener('click', closeIfClickOutside)
  })
</script>

<template>
  <div class="md-select" :class="{ open: show, span }" ref="select">
    <div
      tabindex="0"
      class="md-select-wrapper"
      @click="toggle"
      @pointerdown="rippleEffect"
      @keydown="keyboardClick"
    >
      <div
        class="md-select-single"
        v-if="value?.length === 1 && !multiple && items[value[0]]"
      >
        <div class="md-select-option">
          <component :is="optionComp" v-bind="items[value[0]]" />
        </div>
      </div>

      <div class="md-select-single" v-if="value?.length === 0 && !multiple">
        <div class="md-select-placeholder">{{ placeholder }}</div>
      </div>

      <div class="select-multi" v-if="multiple">
        <input
          v-model="search"
          type="text"
          class="search"
          placeholder="Search..."
        />
      </div>
      <div class="md-select-icon">
        <Icon icon="mdi:chevron-down" :width="24" />
      </div>
    </div>

    <div class="md-select-options-dropdown" @click="toggle">
      <div
        tabindex="0"
        class="md-select-option empty"
        v-if="!required && !multiple"
        @click="() => handleClick()"
        @pointerdown="rippleEffect"
        :class="{ active: val.length === 0 }"
      />
      <div
        tabindex="0"
        class="md-select-option"
        v-for="(item, index) in items"
        :key="index"
        :data-index="index"
        @pointerdown="rippleEffect"
        @click="() => handleClick(index)"
        :class="{ active: val.includes(index) }"
      >
        <component :is="optionComp" v-bind="item" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .md-select {
    position: relative;

    --size: var(--size-md);

    &.span {
      width: 100%;
      flex-grow: 1;
    }

    .md-select-wrapper {
      display: grid;
      grid-template-columns: 1fr 48px;
      align-items: center;
      height: var(--size);
      position: relative;
      overflow: hidden;
      border-radius: var(--xs);
      border: 1px solid var(--primary-60-30);

      &:empty::after {
        content: 'No item selected';
        display: block;
        text-align: center;
        font-size: var(--font-lg);
      }

      .md-select-icon {
        line-height: 0;
        place-self: center;
        transition: transform 0.25s var(--timing-standard);
      }

      .md-select-placeholder {
        font-size: var(--font-lg);
        padding-inline: var(--lg);
        color: var(--mono-60);
      }
    }

    .md-select-options-dropdown {
      position: absolute;
      top: var(--size);
      left: 0;
      width: 100%;
      background: var(--primary-10);
      border: 1px solid var(--primary-60-30);
      border-radius: 0 0 var(--xs) var(--xs);
      border-top: none;
      overflow: auto;
      pointer-events: none;
      min-height: var(--size);
      max-height: calc(var(--size) * 3.1);
      opacity: 0;
      transform: scaleY(0.9);
      z-index: 5;
      transform-origin: top;
      transition:
        opacity 0.25s var(--timing-standard),
        transform 0.25s var(--timing-standard);
    }

    .md-select-option {
      display: grid;
      align-content: center;
      position: relative;
      overflow: hidden;
      height: var(--size);
      border-bottom: 1px solid var(--primary-60-10);
      cursor: pointer;

      &.active {
        background: var(--primary-60-10);
      }

      &:last-child {
        border-bottom: none;
      }
    }

    &.open {
      .md-select-wrapper {
        box-shadow: 0 0 0 2px inset var(--primary);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

        > .md-select-icon {
          transform: rotate(180deg);
          transform-origin: center;
        }
      }

      .md-select-options-dropdown {
        opacity: 1;
        pointer-events: initial;
        transform: scaleY(1);
      }
    }
  }
</style>
