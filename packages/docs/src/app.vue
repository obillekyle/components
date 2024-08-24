<script setup lang="ts">
  import pages from '@/router/pages'
  import IconButton from '@vue-material/core/Button/icon-button.vue'
  import Layout from '@vue-material/core/Layout/layout.vue'
  import { useLocalStorage } from '@vue-material/core/utils/ref'

  import Navigation from '@vue-material/core/Navigation'

  import { LinearProgress } from '@vue-material/core'
  import { computed, onMounted, provide, ref } from 'vue'
  import { RouterView, useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const loader = ref<HTMLDivElement>()

  const loading = ref(false)

  let timeout: any = 0
  router.beforeEach((to, from, next) => {
    loading.value = true
    clearTimeout(timeout)
    loader.value?.setAttribute('show', '')
    next()
  })

  router.afterEach(() => {
    if (loader.value) {
      loader.value.removeAttribute('show')
      timeout = setTimeout(() => {
        loading.value = false
      }, 200)
    }
  })

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
  const color = useLocalStorage('theme-color', '#44BD87')
  const isDark = useLocalStorage('is-dark', true)
  const version = useLocalStorage('version', 'unknown')
  const inputColor = ref<HTMLInputElement>()

  const hoverPage = ref<string>()
  provide('hover-page', hoverPage)
  provide('is-dark', isDark)
  provide('input-color', inputColor)
  provide('version', version)

  const page = computed(() => {
    const [, page] = route.path.split('/')
    return page
  })

  const tab = computed(() =>
    Object.keys(pages).indexOf(page.value || 'home')
  )

  onMounted(async () => {
    const req = await fetch('https://registry.npmjs.org/@vue-material/core')
    const json = await req.json()
    version.value = json['dist-tags'].latest
  })
</script>

<template>
  <Layout
    :options="{
      color: '$on-surface',
      theme: isDark ? 'dark' : 'light',
      colors: {
        primary: color
      }
    }"
  >
    <template #navbar>
      <Navigation :active="tab">
        <template
          :key
          v-for="({ name, icon, active, pages }, key) in pages"
        >
          <Navigation.Item
            v-if="key == 'home'"
            :icon="page == '' ? (active ?? icon) : icon"
            @click="router.push('/')"
          >
            {{ name }}
          </Navigation.Item>

          <Navigation.Item
            v-else
            :icon="page === key ? (active ?? icon) : icon"
            @click="router.push('/' + key)"
            @mouseenter="pages && (hoverPage = key)"
          >
            {{ name }}
          </Navigation.Item>
        </template>

        <Navigation.Content>
          <IconButton
            variant="outlined"
            @click="isDark = !isDark"
            aria-label="Change Theme"
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
            aria-label="Change Color Input"
          />
          <IconButton
            selected
            variant="filled"
            aria-label="Change Color"
            @click="inputColor?.click()"
            icon="material-symbols:palette-outline"
          />
        </Navigation.Content>
      </Navigation>
    </template>

    <div class="loader" ref="loader">
      <LinearProgress v-if="loading" />
    </div>

    <RouterView />
  </Layout>
</template>

<style lang="scss">
  .input-color {
    margin: 0;
    padding: 0;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }

  .loader {
    position: fixed;
    inset-inline: 0;
    top: 0;
    z-index: 10;
    transform: translateY(-100%);
    transition: transform 0.2s;
    pointer-events: none;

    &[show] {
      transform: translateY(0);
    }
  }
</style>
