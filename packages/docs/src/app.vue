<script setup lang="ts">
  import pages from '@/router/pages'
  import { useLocalStorage } from '@vue-material/core'
  import IconButton from '@vue-material/core/Button/icon-button.vue'
  import Layout from '@vue-material/core/Layout/layout.vue'

  import Navigation from '@vue-material/core/Navigation'

  import { computed, provide, ref } from 'vue'
  import { RouterView, useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  /**
   * Ref<string> is still the type inside template
   *
   * ```ts
   * Type 'Ref<string>' is not assignable to type
   * 'string | PartialObjectDeep<Colors, {}> | undefined'.
   *
   * // inside template its
   * (property) color: Ref<string>
   * const color: Ref<string>
   *
   * ```
   * increment days wasted fixing types
   * ```ts
   * 4
   * ```
   *
   * **Update**: theres a node_modules folder inside `packages/docs`
   * while `packages/lib` uses root node_modules
   * because of that, types won't match
   */
  const color = useLocalStorage('theme-color', '#00ddff')
  const isDark = useLocalStorage('is-dark', true)
  const inputColor = ref<HTMLInputElement>()

  const hoverPage = ref<string>()
  provide('hover-page', hoverPage)
  provide('is-dark', isDark)
  provide('input-color', inputColor)

  const page = computed(() => {
    const [, page] = route.path.split('/')
    return page
  })

  const tab = computed(() =>
    Object.keys(pages).indexOf(page.value || 'home')
  )
</script>

<template>
  <Layout
    :options="{
      color: '#on-surface',
      theme: isDark ? 'dark' : 'light',
      colors: {
        primary: color
      }
    }"
  >
    <template #navbar>
      <Navigation :active="tab">
        <template :key v-for="({ name, icon, active }, key) in pages">
          <Navigation.Item
            v-if="key == 'home'"
            :icon="page === key ? (active ?? icon) : icon"
            @click="router.push('/')"
          >
            {{ name }}
          </Navigation.Item>

          <Navigation.Item
            v-else
            :icon="page === key ? (active ?? icon) : icon"
            @click="router.push('/' + key)"
            @mouseenter="
              () => {
                if (route.path != '/') hoverPage = key
              }
            "
          >
            {{ name }}
          </Navigation.Item>
        </template>

        <Navigation.Content>
          <IconButton
            variant="outlined"
            @click="isDark = !isDark"
            :icon="
              isDark
                ? 'material-symbols:light-mode-outline'
                : 'material-symbols:dark-mode-outline'
            "
          />
        </Navigation.Content>
        <Navigation.Content pb="#md">
          <input
            type="color"
            v-model="color"
            class="input-color"
            ref="inputColor"
          />
          <IconButton
            selected
            variant="filled"
            @click="inputColor?.click()"
            icon="material-symbols:palette-outline"
          />
        </Navigation.Content>
      </Navigation>
    </template>

    <RouterView />
  </Layout>
</template>

<style>
  .input-color {
    margin: 0;
    padding: 0;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
</style>
