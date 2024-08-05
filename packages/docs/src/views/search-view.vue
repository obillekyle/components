<script setup lang="ts">
  import type { Page } from '@/router/pages'
  import pages from '@/router/pages'
  import { Icon } from '@iconify/vue'
  import {
    keyboardClick,
    toKebabCase,
    useLocalStorage
  } from '@vue-material/core'
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  type ExtendedPage = Page & {
    path: string
  }

  const search = ref('')
  const router = useRouter()
  const input = ref<HTMLInputElement>()
  const recent = useLocalStorage<ExtendedPage[]>('recents', [])

  const mapped = computed(() => {
    if (!search.value) return recent.value

    const all = Object.entries(pages).flatMap(([key, value]) => {
      const self: ExtendedPage = {
        ...value,
        path: key
      }

      const child: ExtendedPage[] = Object.entries(value.pages ?? {}).map(
        ([key2, value]) => {
          return {
            ...value,
            path: `${key}/${toKebabCase(key2)}`
          }
        }
      )

      return [self, child].flat()
    })

    return all.filter((page) => {
      if (page.path === 'search') return false
      return (
        page.name.toLowerCase().includes(search.value.toLowerCase()) ||
        page.path.toLowerCase().includes(search.value.toLowerCase())
      )
    })
  })

  onMounted(() => {
    if (input.value) input.value.focus()
  })
</script>

<template>
  <div class="search-view">
    <input
      class="search"
      v-model="search"
      placeholder="Search..."
      ref="input"
    />

    <div class="search-result">
      <div
        tabindex="0"
        v-for="page in mapped"
        :key="page.path"
        class="search-item"
        @keypress="keyboardClick"
        @click="router.push(page.path)"
      >
        <Icon :icon="page.icon" :width="24" />
        <span>{{ page.name }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .search-view {
    font-size: var(--font-xxl);

    input {
      width: 100%;
      border-radius: 999px;
      font-size: var(--font-xxl);
      height: var(--component-xl);
      padding-inline: var(--xl);
      margin-bottom: var(--md);
      border: 1px solid var(--outline);
      transition: border 0.2s;

      &:focus {
        border: 1px solid var(--primary);
      }
    }

    .search-item {
      display: flex;
      align-items: center;
      gap: var(--sm);
      padding: var(--md);
      border-radius: var(--component-md);
      cursor: pointer;

      &:hover {
        background: var(--surface-container-low);
      }
    }
  }
</style>
