<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { keyClick } from '@vue-material/core'
  import Box from '@vue-material/core/Box'
  import { customRef } from '@vue-material/core/ref'
  import { $ } from '@vue-material/core/utils/dom'
  import { codeToHtml } from 'shiki/bundle/web'
  import { computed, inject, onMounted, ref, watch } from 'vue'

  const theme = inject('options', ref({ theme: 'light' }))
  const isDark = computed(() => theme.value.theme === 'dark')

  const props = defineProps<{
    height?: string
    hide?: boolean
  }>()

  const hidden = ref(props.hide)

  const [root, setRef] = customRef<HTMLElement>()
  const language = ref('vue')
  const copied = ref(false)

  function copy() {
    if (root.value) {
      const pre = $('pre', root.value) ?? root.value
      const code = $('code', pre)
      if (code) {
        navigator.clipboard.writeText(code.textContent ?? '')
        copied.value = true

        setTimeout(() => (copied.value = false), 3000)
      }
    }
  }

  async function highlight() {
    if (root.value) {
      const pre = $('pre', root.value) ?? root.value
      const code = $('code', pre) ?? pre
      const className = pre.className || code.className
      const theme = isDark.value ? 'dark-plus' : 'light-plus'
      const lang = className.replace('language-', '') || 'vue'
      const html = await codeToHtml(pre.textContent ?? '', {
        lang,
        theme
      })
      pre.innerHTML = html
      pre.className = lang
      language.value = lang
    }
  }

  onMounted(highlight)
  watch(root, highlight)
  watch(isDark, highlight)
</script>

<template>
  <Box class="preview-code" :class="{ hidden }" :ref="setRef" :height>
    <div class="code-header">
      <span class="code-language">{{ language }}</span>
      <span class="code-actions">
        <span
          tabindex="0"
          @click="copy"
          @keypress="keyClick($event, ['Enter', ' '])"
        >
          <Icon
            :icon="
              copied
                ? 'material-symbols:check'
                : 'material-symbols:content-copy-outline'
            "
            :width="24"
            :color="copied ? 'green' : undefined"
          />
        </span>
        <span
          tabindex="0"
          @click="hidden = !hidden"
          @keypress="keyClick($event, ['Enter', ' '])"
        >
          <Icon
            :icon="
              hidden
                ? 'material-symbols:expand-content'
                : 'material-symbols:hide'
            "
            :width="24"
          />
        </span>
      </span>
    </div>
    <slot />
  </Box>
</template>

<style lang="scss">
  .preview-code {
    position: relative;

    code {
      font-family: 'JetBrains Mono', monospace;
    }

    > pre {
      height: calc(100% - var(--component-sm));
    }

    pre {
      margin: 0;
      line-height: 1.5;

      &::-webkit-scrollbar {
        width: var(--xs);
        height: var(--xs);

        &-thumb {
          background: var(--surface-container-highest);
          opacity: 0.5;
          border-radius: 4px;
        }

        &-corner {
          background: transparent;
        }
      }
    }

    &.hidden {
      height: 100% !important;

      pre {
        display: none;
      }
    }

    pre:not(.shiki) {
      &:has(> code) {
        padding: var(--md);
        background: var(--surface-container);
        font-size: var(--font-sm);
        overflow: auto;
      }
    }

    .code-header {
      display: flex;
      padding-inline: var(--md);
      align-items: center;
      min-height: var(--component-sm);
      font-size: var(--font-sm);
      line-height: 0;
      background: var(--surface-container);

      .code-actions {
        display: flex;
        margin-left: auto;
        gap: var(--xs);

        > * {
          cursor: pointer;
        }
      }
    }

    pre.shiki {
      padding: var(--md);
      font-size: var(--font-sm);
      height: 100%;
      overflow: auto;
    }
  }
</style>
