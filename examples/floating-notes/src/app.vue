<script setup lang="ts">
  import {
    Box,
    Divider,
    IconButton,
    Layout,
    ScrollContainer,
    Slider,
    clamp,
    customRef,
    targetsSelf,
    useDrag,
    useFocusLock,
    useLocalStorage,
    useToggle,
    useRect,
    useWindowSize
  } from '@vue-material/core'
  import { onMounted, computed, ref, watch } from 'vue'

  const text = ref<HTMLElement>()
  const [root, rootRef] = customRef<HTMLElement>()
  const [editing, toggle] = useToggle()

  defineOptions({ name: 'FloatingNotes' })

  type Settings = {
    position: { x: number; y: number }
    align: 'left' | 'center' | 'right'
    pinned: boolean
    opacity: number
    extra: boolean
    wrap: boolean
  }

  const data = useLocalStorage('note', '')
  const settings = useLocalStorage<Settings>('settings', {
    position: { x: 0, y: 0 },
    align: 'left',
    pinned: false,
    opacity: 1,
    extra: true,
    wrap: true
  })

  useFocusLock(root)
  const wRect = useWindowSize()
  const rect = useRect(root)

  const position = computed(() => {
    if (!rect.ready) {
      return {
        top: 0,
        left: 0
      }
    }

    return {
      top: clamp(settings.value.position.y, 0, wRect.height - rect.height),
      left: clamp(settings.value.position.x, 0, wRect.width - rect.width)
    }
  })

  let start = {
    top: 0,
    left: 0,
    x: 0,
    y: 0
  }

  let end = {
    top: 0,
    left: 0,
    x: 0,
    y: 0
  }

  const [dragging, dragEvent] = useDrag((pos) => {
    if (!root.value || settings.value.pinned) return

    const rect = root.value.getBoundingClientRect()

    const { x, y } = pos

    start.x ||= x || 0.1
    start.y ||= y || 0.1
    start.top ||= rect.top || 0.1
    start.left ||= rect.left || 0.1

    const top = clamp(
      start.top + (y - start.y),
      0,
      wRect.height - rect.height
    )
    const left = clamp(
      start.left + (x - start.x),
      0,
      wRect.width - rect.width
    )

    end.x = x
    end.y = y
    end.top = top
    end.left = left

    root.value!.style.top = `${top}px`
    root.value!.style.left = `${left}px`
  })

  function dragHandler(event: any) {
    if (settings.value.pinned) return
    dragEvent(event)
  }

  watch(dragging, (state) => {
    if (state === true) {
      settings.value.extra = false
      return
    }

    if (state === false && root.value) {
      const { left: x, top: y } = end
      settings.value.position = { x, y }

      end = { top: 0, left: 0, x: 0, y: 0 }
      start = { top: 0, left: 0, x: 0, y: 0 }
    }
  })

  function updateContent() {
    if (text.value) text.value.textContent = data.value
  }

  watch(data, updateContent)
  watch(editing, (state) => {
    if (state === true && text.value) text.value.focus()
    if (state === false && text.value) {
      data.value = text.value.textContent || ''
    }
  })
  onMounted(updateContent)
</script>

<template>
  <Layout class="container">
    <Box
      :ref="rootRef"
      class="window"
      :class="{ dragging }"
      width="400"
      :styled="{
        opacity: settings.opacity,
        left: position.left,
        top: position.top
      }"
    >
      <Box.Flex
        px="#sm"
        width="100%"
        align="center"
        height="#size-md"
        class="window-top-bar"
        @pointerdown="targetsSelf($event, dragHandler)"
      >
        <IconButton
          @click="settings.pinned = !settings.pinned"
          :icon="settings.pinned ? 'mdi:pin' : 'mdi:pin-outline'"
        />
        <Box.Flex ml="auto">
          <IconButton
            @click="data = ''"
            icon="mdi:delete-outline"
            v-if="data && !editing"
          />
          <IconButton
            @click="toggle"
            :icon="editing ? 'mdi:close' : 'mdi:pencil-outline'"
          />
        </Box.Flex>
      </Box.Flex>

      <ScrollContainer
        class="window-content"
        :styled="{
          wordWrap: settings.wrap ? 'break-word' : 'normal',
          whiteSpace: settings.wrap ? 'pre' : 'normal',
          textAlign: settings.align
        }"
      >
        <div
          class="window-text"
          :contenteditable="editing && 'plaintext-only'"
          ref="text"
          tabindex="0"
        >
          {{ data }}
        </div>
      </ScrollContainer>

      <div class="window-bottom-bar">
        <Box.Flex class="window-bottom-bar-align" mr="auto">
          <IconButton
            @click="settings.align = 'left'"
            :selected="settings.align == 'left'"
            icon="mdi:format-align-left"
          />
          <IconButton
            @click="settings.align = 'center'"
            :selected="settings.align == 'center'"
            icon="mdi:format-align-center"
          />
          <IconButton
            @click="settings.align = 'right'"
            :selected="settings.align == 'right'"
            icon="mdi:format-align-right"
          />

          <Divider direction="y" />

          <IconButton
            @click="settings.wrap = !settings.wrap"
            :icon="settings.wrap ? 'mdi:wrap' : 'mdi:wrap-disabled'"
          />
        </Box.Flex>
        <IconButton
          :icon="settings.extra ? 'mdi:chevron-up' : 'mdi:chevron-down'"
          @click="settings.extra = !settings.extra"
        />
      </div>
      <div class="window-extra" v-if="settings.extra">
        <span>Background opacity: {{ settings.opacity }}</span>
        <Slider
          class="window-extra-slider"
          :step="0.01"
          :min="0.25"
          :max="1"
          v-model="settings.opacity"
        />
      </div>
    </Box>
  </Layout>
</template>

<style lang="scss">
  .container {
    background: transparent;
    overflow: layout;
  }

  .window {
    position: fixed;
    display: grid;
    background-color: var(--surface-container);
    border-radius: var(--sm);
    transition:
      opacity 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;

    &:hover,
    &.dragging {
      opacity: 1;
      box-shadow: var(--shadow-2);
    }

    &-top-bar {
      width: 100%;
      height: var(--size-md);
    }

    &-content {
      height: 100%;
    }

    &-text {
      &:empty::before {
        content: "What's on your mind?";
        pointer-events: none;
        color: var(--on-surface-variant);
        font-style: italic;
      }

      &:focus {
        outline: none;
      }
    }

    &-bottom-bar {
      width: 100%;
      display: flex;
      border-top: 1px solid var(--outline-variant);
      height: var(--component-md);
    }

    &-extra {
      border-top: 1px solid var(--outline-variant);
      padding: var(--sm);
    }
  }
</style>
