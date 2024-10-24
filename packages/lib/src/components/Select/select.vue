<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import type { MixedValues } from '@/utils/other/to-object-value'

  import { keyClick } from '@/utils/dom/events'
  import { rippleEffect } from '@/utils/dom/ripple'
  import { Icon } from '@iconify/vue'
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { filterByLabel, toggleItem } from './util'
  import { useValue } from '@/ref/use-form-value'
  import { toObjectValue } from '@/utils/other/to-object-value'

  import OptionItem from './option-item.vue'

  interface SelectProps
    extends /* @vue-ignore */ Omit<HTMLAttributes, 'onChange'> {
    value?: (string | number)[]
    defaultValue?: (string | number)[]
    items?: MixedValues
    multiple?: boolean
    required?: boolean
    placeholder?: string
  }

  type SelectEmits = {
    (e: 'change', value: (string | number)[]): void
  }

  const show = ref(false)
  const search = ref('')
  const select = ref<HTMLElement>()

  const props = defineProps<SelectProps>()
  const emits = defineEmits<SelectEmits>()
  const model = defineModel<(string | number)[]>()
  const values = computed(() => toObjectValue(props.items ?? []))
  const selected = useValue([], props, model, (value) => {
    emits('change', value)
    return value
  })

  const filteredItems = computed(() => {
    const query = search.value.toLowerCase()
    return query ? filterByLabel(values.value, query) : values.value
  })

  const firstSelected = computed(() => {
    if (props.multiple || selected.value.length === 0) return
    return values.value.find((item) => item.value === selected.value[0])
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
    if (show.value && !select.value?.contains(event.target as Node)) {
      show.value = false
    }
  }

  onMounted(() => addEventListener('click', closeIfClickOutside))
  onUnmounted(() => removeEventListener('click', closeIfClickOutside))
</script>

<template>
  <div
    ref="select"
    class="md-select"
    :open="show || undefined"
    :multiple="multiple || undefined"
  >
    <div
      tabindex="0"
      class="md-select-wrapper"
      @click="show = !show"
      @pointerdown="rippleEffect"
      @keypress="keyClick"
    >
      <div class="md-select-single" v-if="!multiple">
        <div class="md-select-option" v-if="firstSelected">
          <slot v-bind="firstSelected">
            <OptionItem v-bind="firstSelected" />
          </slot>
        </div>
        <div class="md-select-placeholder" v-else>{{ placeholder }}</div>
      </div>

      <div class="md-select-multi" v-if="multiple">
        <template v-if="selected.length > 0">
          <div
            :key="item"
            v-for="item in selected"
            class="md-select-multi-chip"
          >
            <span> {{ values.find((i) => i.value === item)?.label }} </span>
            <Icon icon="mdi:close" @click="handleClick(item)" />
          </div>
        </template>

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

    <div class="md-select-dropdown" @click="show = false">
      <div
        class="md-select-option empty"
        v-if="!required && !multiple"
        :tabindex="show ? 0 : -1"
        @click="handleClick()"
        @pointerdown="rippleEffect"
        :class="{ active: selected.length === 0 }"
      />
      <div
        class="md-select-option"
        v-for="item in filteredItems"
        :tabindex="show ? 0 : -1"
        :key="item.value"
        @keypress="keyClick"
        @click="handleClick(item.value)"
        @pointerdown="rippleEffect"
        :class="{ active: selected.includes(item.value) }"
      >
        <slot v-bind="item" :active="selected.includes(item.value)">
          <OptionItem v-bind="item" />
        </slot>
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

    > :has(.md-select-placeholder) {
      grid-area: placeholder;
    }

    &-wrapper {
      display: grid;
      grid-template-columns: 1fr 48px;
      grid-template-areas: 'placeholder icon';
      align-items: center;
      min-height: var(--size);
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
    }

    &-multi {
      display: flex;
      gap: var(--xs);
      padding: var(--xs);
      flex-wrap: wrap;
      align-items: center;

      input {
        height: 100%;
        background: none;
        border: none;
        outline: none;
        font: inherit;
      }

      &-chip {
        background: var(--primary);
        color: var(--on-primary);
        padding: var(--xxs) var(--xs);
        border-radius: var(--xxs);
        font-size: var(--font-sm);
        display: flex;
        align-items: center;
      }
    }

    &-icon {
      line-height: 0;
      grid-area: icon;
      place-self: center;
      transition: transform 0.25s var(--timing-standard);
    }

    &-placeholder {
      font-size: var(--font-lg);
      padding-inline: var(--lg);
      color: var(--mono-60);
    }

    &-dropdown {
      position: absolute;
      top: var(--size);
      left: 0;
      width: 100%;
      background: var(--surface-container);
      border: 1px solid var(--outline);
      border-radius: 0 0 var(--xxs) var(--xxs);
      border-top: none;
      pointer-events: none;
      min-height: var(--size);
      max-height: calc(var(--size) * 3.1);
      transform-origin: top;
      transform: scaleY(0.9);
      overflow: auto;
      opacity: 0;
      z-index: 5;
      transition:
        opacity 0.25s var(--timing-standard),
        transform 0.25s var(--timing-standard);
    }

    &-option {
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
        background: var(--primary);
        transition: opacity 0.25s var(--timing-standard);
      }

      &.active {
        color: var(--on-primary);

        &::before {
          opacity: 1;
        }
      }

      &:last-child {
        border-bottom: none;
      }
    }

    &[open],
    &:has(input:focus) {
      .md-select-wrapper {
        box-shadow: 0 0 0 2px inset var(--primary);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

        > .md-select-icon {
          transform: rotate(180deg);
          transform-origin: center;
        }
      }

      .md-select-dropdown {
        opacity: 1;
        pointer-events: initial;
        transform: scaleY(1);
      }
    }
  }
</style>
