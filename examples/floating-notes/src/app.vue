<script setup lang="ts">
  import {
    Box,
    Divider,
    IconButton,
    Layout,
    ScrollContainer,
    clamp,
    customRef,
    targetsSelf,
    useDrag,
    useFocusLock,
    useLocalStorage,
    useToggle,
    useWindowSize
  } from '@vue-material/core'
  import { onMounted, ref, watch } from 'vue'

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

  watch(dragging, (state) => {
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
      width="400"
      :styled="{
        left: settings.position.x,
        top: settings.position.y
      }"
    >
      <Box.Flex
        px="#sm"
        width="100%"
        align="center"
        height="#size-md"
        class="window-top-bar"
        @pointerdown="targetsSelf($event, dragEvent)"
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

      <ScrollContainer class="window-content">
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
          :icon="settings.extra ? 'mdi:chevron-down' : 'mdi:chevron-up'"
          @click="settings.extra = !settings.extra"
        />
      </div>
    </Box>
  </Layout>
</template>

<style lang="scss">
  .container {
    background: transparent;
  }

  .window {
    position: absolute;
    display: grid;
    background-color: var(--surface-container);
    border-radius: var(--sm);

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
  }
</style>
