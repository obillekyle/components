<script setup lang="ts">
  import '../assets/markdown.scss'

  import type { MetaOptions } from './content-utils'

  import {
    $,
    Box,
    IconButton,
    ScrollContainer,
    Text,
    customRef
  } from '@vue-material/core'
  import {
    computed,
    defineAsyncComponent,
    inject,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    watch
  } from 'vue'
  import { useRoute } from 'vue-router'
  import { fetchComponent } from './content-utils'

  import ContentDocs from './content-docs.vue'
  import ContentError from './content-error.vue'
  import ContentFooter from './content-footer.vue'
  import ContentHeader from './content-header.vue'
  import ContentLoader from './content-loader.vue'
  import ContentOutline from './content-outline.vue'
  import GlobalFooter from './global-footer.vue'

  const route = useRoute()
  const headers = ref<HTMLElement[]>([])
  const [content, setRef] = customRef<HTMLElement>()
  const isDark = inject('is-dark', ref(false))
  const inputColor = inject('input-color', ref<HTMLInputElement>())

  let timeout: any
  const error = ref(false)
  const ready = ref(false)
  const sidebar = ref(false)
  const meta = ref<MetaOptions>()

  defineOptions({ name: 'CoreView' })

  provide('headers', headers)
  provide('content', content)
  provide('sidebar', sidebar)

  // prevent reload on hash change
  const path = computed(() => route.path)
  const loadComponent = computed(() => {
    const [, category, file] = path.value.split('/')
    return defineAsyncComponent(async () => {
      try {
        const component = await fetchComponent(category, file)
        if (component.meta) meta.value = component.meta
        ready.value = true
        return component
      } catch (error_) {
        console.error(error_)
        error.value = true
      }
    })
  })

  watch(path, () => {
    error.value = false
    ready.value = false
    meta.value = undefined
    headers.value = []
    content.value?.scrollTo(0, 0)
  })

  function getHeaders() {
    timeout && clearTimeout(timeout)
    timeout = setTimeout(() => {
      const element = content.value
      if (!element || element.textContent === '') return getHeaders()
      const wrapper = $('.content-wrapper', element) ?? element
      headers.value = [...wrapper.querySelectorAll('h1, h2, h3')] as any[]
    }, 200)
  }

  onMounted(() => getHeaders())
  onBeforeUnmount(() => clearTimeout(timeout))
  watch(loadComponent, getHeaders)
</script>

<template>
  <div class="content">
    <ContentDocs />

    <Box class="content-app-bar">
      <IconButton
        icon="material-symbols:menu"
        @click="sidebar = !sidebar"
      />
      <Text class="content-title" mr="auto">{{ meta?.title }}</Text>
      <IconButton
        @click="isDark = !isDark"
        :icon="
          isDark
            ? 'material-symbols:dark-mode-outline'
            : 'material-symbols:light-mode-outline'
        "
      />
      <IconButton
        selected
        variant="filled"
        @click="inputColor?.click()"
        icon="material-symbols:palette-outline"
      />
    </Box>
    <ScrollContainer class="content-body" p="0" :ref="setRef">
      <ContentHeader
        :meta
        v-if="meta && !meta.hide && route.params.content[1]"
      />
      <div class="content-wrapper">
        <div class="content-inner marked-content">
          <loadComponent />
        </div>
        <ContentFooter v-if="headers.length > 0" />
      </div>

      <ContentError v-if="error" />
      <ContentLoader v-else-if="!ready" />
      <GlobalFooter />
    </ScrollContainer>

    <ContentOutline />
  </div>
</template>

<style lang="scss">
  .content {
    inset: 0;
    position: absolute;
    display: grid;
    grid-template-columns: 300px minmax(auto, 1200px) minmax(250px, auto);
    overflow: overlay;

    &-app-bar {
      position: sticky;
      top: 0;
      z-index: 2;
      display: none;
      background: var(--surface);
      box-shadow: 0 0 0 1px var(--neutral-80);
      height: var(--header-size);
      padding-inline: var(--xs);
    }

    > *::-webkit-scrollbar {
      width: var(--xs);

      &-track {
        background: var(--surface-container);
      }

      &-thumb {
        background: var(--secondary-container);
      }
    }

    &-header {
      display: flex;
      flex-direction: column;
      grid-area: header;
      gap: var(--sm);
      background: var(--surface);
      color: var(--on-surface);
      padding: var(--xl);
      padding-bottom: 0;
    }

    &-outline {
      margin-right: auto;
      color: var(--on-surface);
      border-left: 1px solid var(--neutral-80);
      padding: var(--xl) var(--md);
      display: flex;
      flex-direction: column;
      align-items: start;

      > * {
        padding-block: var(--xs);
        height: auto !important;
      }

      .md-button-label {
        white-space: wrap;
        max-width: 180px !important;
        text-align: left;
      }
    }

    &-error {
      width: 100%;
      display: grid;
      margin-top: 20dvh;
      text-align: center;
      place-items: center;
      color: var(--outline);

      &-title {
        font-size: var(--component-md);
        text-wrap: nowrap;
      }

      &-description {
        font-size: var(--font-lg);
        text-wrap: balance;
        padding: var(--xl);
      }
    }

    &-docs {
      background-color: var(--surface-container-low);
      border-right: 1px solid var(--neutral-80);
      max-width: 300px;

      &-menu {
        display: none;
      }
    }

    &-body {
      width: 100%;
      max-width: 1200px;
    }

    &-wrapper {
      padding: var(--xl);
      display: flex;
      flex-direction: column;
      max-width: 800px;
      min-height: calc(100dvh - var(--header-size));
      margin-inline: auto;
    }

    &-inner {
      > * {
        opacity: 0;
        animation: in 0.2s forwards;
      }

      @keyframes in {
        to {
          opacity: 1;
        }
      }
    }

    &-links {
      display: flex;
      margin-top: var(--xs);
      gap: var(--xs);
    }
  }

  @media (width <= 1300px) {
    .content {
      grid-template-columns: 250px auto;

      &-outline {
        display: none;
      }
    }
  }

  @media (width <= 1000px) {
    .content {
      grid-template-columns: auto;

      > *::-webkit-scrollbar {
        display: none;
      }

      &-docs {
        position: absolute;
        left: 0;
        transform: translateX(-100%);
        transition: transform 0.2s;
        z-index: 10;

        &.hover {
          transform: translateX(0);
        }
      }
    }
  }

  @media (width <= 600px) {
    .content {
      &-app-bar {
        display: flex;
        align-items: center;
      }

      &-wrapper {
        padding-inline: 0;
      }

      &-footer {
        flex-wrap: wrap;
        padding-inline: var(--lg);

        > * {
          flex: 1 1 auto;
        }
      }

      &-inner {
        > * {
          margin-inline: var(--lg) !important;
          max-width: calc(100% - 2 * var(--lg)) !important;
        }

        > h2,
        > h3 {
          position: sticky;
          z-index: 3;
          max-width: 100% !important;
          margin-inline: 0 !important;
          padding-inline: var(--lg);
          background: var(--surface);
          top: -2px;

          &::before {
            width: 1.5ch !important;
            color: var(--primary);
          }
        }
      }

      &-docs {
        &-menu {
          display: block;
        }

        &.hover {
          transform: translateX(-100%);
        }

        &.open {
          transform: translateX(0) !important;
        }
      }
    }
  }
</style>
