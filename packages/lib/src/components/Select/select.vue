<script setup lang="ts">
  import type { Component, HTMLAttributes } from 'vue'
  import type { SelectItem } from './util'

  import { fnRef } from '@/ref/fn-ref'
  import { keyClick } from '@/utils/dom/events'
  import { rippleEffect } from '@/utils/dom/ripple'
  import { Icon } from '@iconify/vue'
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import { filterByName, toSelectItems, toggleItem } from './util'

  import OptionItem from './option-item.vue'

  interface SelectProps
    extends /* @vue-ignore */ Omit<HTMLAttributes, 'onChange'> {
    value?: number[]
    defaultValue?: number[]
    items?: (number | string | SelectItem)[]
    optionComp?: Component
    multiple?: boolean
    required?: boolean
    placeholder?: string
  }

  type SelectEmits = {
    (e: 'change', value: number[]): void
  }

  const show = ref(false)
  const search = ref('')
  const options = ref<HTMLElement[]>([])
  const setOptions = fnRef(options)
  const select = ref<HTMLElement>()

  const emit = defineEmits<SelectEmits>()
  const props = withDefaults(defineProps<SelectProps>(), {
    optionComp: OptionItem,
    multiple: false,
    required: false
  })

  const values = computed(() => toSelectItems(props.items ?? []))
  const model = defineModel<number[]>()
  const selected = computed({
    get: () => props.value ?? model.value ?? props.defaultValue ?? [],
    set: (value) => {
      model.value = value
      emit('change', value)
    }
  })

  const filteredItems = computed(() => {
    const query = search.value.toLowerCase()
    return query ? filterByName(values.value, query) : values.value
  })

  defineOptions({ name: 'MdSelect' })

  function handleClick(index?: number) {
    if (index === undefined) {
      if (props.multiple || props.required) return
      selected.value = []
      return
    }

    selected.value = props.multiple
      ? toggleItem(selected.value, index)
      : [index]
  }

  watch(show, (show) => {
    if (show) options.value[0]?.focus()
  })

  function closeIfClickOutside(event: MouseEvent) {
    if (show.value && !select.value?.contains(event.target as Node)) {
      show.value = false
    }
  }

  onMounted(() => addEventListener('click', closeIfClickOutside))
  onUnmounted(() => removeEventListener('click', closeIfClickOutside))
</script>

<template>
  <div class="md-select" :open="show || undefined" ref="select">
    <div
      tabindex="0"
      class="md-select-wrapper"
      @click="show = !show"
      @pointerdown="rippleEffect"
      @keypress="keyClick"
    >
      <div
        class="md-select-single"
        v-if="selected.length === 1 && !multiple && values[selected[0]]"
      >
        <div class="md-select-option">
          <component :is="optionComp" v-bind="values[selected[0]]" />
        </div>
      </div>

      <div
        class="md-select-single"
        v-if="selected.length === 0 && !multiple"
      >
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

    <div class="md-select-options-dropdown" @click="show = false">
      <div
        tabindex="0"
        class="md-select-option empty"
        v-if="!required && !multiple"
        @click="handleClick()"
        @pointerdown="rippleEffect"
        :class="{ active: selected.length === 0 }"
      />
      <div
        v-for="(item, index) in filteredItems"
        tabindex="0"
        class="md-select-option"
        :key="index"
        :ref="setOptions"
        :data-index="index"
        @click="handleClick(index)"
        @pointerdown="rippleEffect"
        :class="{ active: selected.includes(index) }"
      >
        <component :is="optionComp" v-bind="item" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .md-select {
    position: relative;

    --size: var(--component-lg);

    &.span {
      width: 100%;
    }

    > *:has(.md-select-placeholder) {
      grid-area: placeholder;
    }

    .md-select-wrapper {
      display: grid;
      grid-template-columns: 1fr 48px;
      grid-template-areas: 'placeholder icon';
      align-items: center;
      height: var(--size);
      position: relative;
      overflow: hidden;
      border-radius: var(--xxs);
      border: 1px solid var(--outline);

      &:empty::after {
        content: 'No item selected';
        display: block;
        text-align: center;
        font-size: var(--font-lg);
      }

      .md-select-icon {
        line-height: 0;
        grid-area: icon;
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
      background: var(--surface-container);
      border: 1px solid var(--outline);
      border-radius: 0 0 var(--xxs) var(--xxs);
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
      color: var(--on-surface-variant);
      cursor: pointer;

      &::before {
        content: '';
        position: absolute;
        inset: var(--xxs);
        opacity: 0;
        z-index: -1;
        border-radius: var(--xxs);
        background: var(--primary-container);
        transition: opacity 0.25s var(--timing-standard);
      }

      &.active {
        color: var(--on-primary-container);

        &::before {
          opacity: 1;
        }
      }

      &:last-child {
        border-bottom: none;
      }
    }

    &[open] {
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
