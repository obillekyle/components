<script setup lang="ts">
  import CodeHighlight from '@/helper/code-highlight.vue'
  import Preview from '@/helper/preview.vue'
  import { Icon } from '@iconify/vue'
  import { Flex } from '@vue-material/core'
  import { ref } from 'vue'

  const install: Record<string, { icon: string; cmd: string }> = {
    npm: {
      icon: 'vscode-icons:file-type-npm',
      cmd: 'npm install @vue-material/core @iconify/vue'
    },
    yarn: {
      icon: 'vscode-icons:file-type-yarn',
      cmd: 'yarn add @vue-material/core @iconify/vue'
    },
    pnpm: {
      icon: 'vscode-icons:file-type-pnpm',
      cmd: 'pnpm add @vue-material/core @iconify/vue'
    },
    bun: {
      icon: 'vscode-icons:file-type-bun',
      cmd: 'bun install @vue-material/core @iconify/vue'
    }
  }

  const tab = ref('npm')
</script>

<template>
  <Preview>
    <Flex class="preview-tab">
      <Flex
        :key
        @click="tab = key"
        class="preview-tab-item"
        v-for="({ icon }, key) in install"
        :class="{ active: tab === key }"
      >
        <Icon :icon :width="24" />
        <span>{{ key }}</span>
      </Flex>
    </Flex>
    <CodeHighlight :key="tab">
      <pre><code class="language-bash">{{ install[tab].cmd }}</code></pre>
    </CodeHighlight>
  </Preview>
</template>

<style lang="scss">
  .preview-tab {
    background: var(--surface);

    &-item {
      cursor: pointer;
      gap: var(--xs);
      font-size: var(--font-sm);
      padding: var(--xs) var(--md);
      align-items: center;

      &.active {
        background: var(--surface-container);
      }
    }
  }
</style>
