<script setup lang="ts">
  import pages from '@/router/pages'
  import { Icon } from '@iconify/vue'
  import {
    IconButton,
    keyboardClick,
    toKebabCase
  } from '@vue-material/core'
  import Flex from '@vue-material/core/Box/Flex'
  import ScrollContainer from '@vue-material/core/Layout/scroll-container.vue'
  import { computed, inject, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const path = computed(() => {
    return typeof route.params.content === 'string'
      ? [route.params.content]
      : route.params.content
  })
  const hoverPage = inject('hover-page', ref<string>())
  const sidebar = inject('sidebar', ref(false))
  const currentPage = computed(() => hoverPage.value || path.value[0])

  function isActive(key: string) {
    return (
      path.value[0] === currentPage.value &&
      path.value[1] === toKebabCase(key)
    )
  }

  function goto(key: string) {
    router.push(`/${currentPage.value}/${toKebabCase(key)}`)
  }
</script>

<template>
  <ScrollContainer
    class="content-docs"
    :class="{ hover: !!hoverPage, open: sidebar }"
    @mouseleave="hoverPage = undefined"
    @click="sidebar = false"
  >
    <IconButton icon="material-symbols:close" class="content-docs-menu" />
    <template v-if="pages[currentPage]">
      <Flex
        tabindex="0"
        @keypress="keyboardClick"
        v-for="(element, key) in pages[currentPage].pages || {}"
        gap="#sm"
        :key="key"
        align="center"
        @click="goto(key)"
        class="content-doc"
        :class="{ active: isActive(key) }"
      >
        <Icon
          class="content-doc-icon"
          :icon="
            isActive(key) ? (element.active ?? element.icon) : element.icon
          "
          :width="24"
        />
        <span class="content-doc-name">{{ element.name ?? key }}</span>
      </Flex>
    </template>
  </ScrollContainer>
</template>

<style lang="scss">
  .content-doc {
    padding: var(--md) var(--xl);
    cursor: pointer;
    border-radius: 999px;
    transition: background-color 0.1s ease-in-out;

    &:hover {
      background: var(--surface-container-low);
    }

    &-name {
      text-transform: capitalize;
      padding-top: 0.1em;
    }

    &.active {
      background: var(--primary);
      color: var(--on-primary);
    }
  }
</style>
