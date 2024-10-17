<script setup lang="ts">
  import { useIDBStorage } from '@/ref/use-idb-storage'
  import { useLocalStorage } from '@/ref/use-local-storage'
  import { provide, ref } from 'vue'

  import TopAppBar from '@/components/AppBar/top-bar.vue'
  import IconButton from '@/components/Button/icon-button.vue'
  import SquareImage from '@/components/Image/square-image.vue'
  import Fab from '@/components/Layout/fab.vue'
  import Layout from '@/components/Layout/layout.vue'
  import ModalProvider from '@/components/Modal/modal-provider.vue'
  import NavBar from '@/components/Navigation/navigation-bar.vue'
  import NavContainer from '@/components/Navigation/navigation-container.vue'
  import NavContent from '@/components/Navigation/navigation-content.vue'
  import NavEntry from '@/components/Navigation/navigation-entry.vue'
  import NavItem from '@/components/Navigation/navigation-item.vue'
  import SheetProvider from '@/components/Sheet/sheet-provider.vue'
  import SnackbarProvider from '@/components/Snackbar/snackbar-provider.vue'
  import MasterSwitch from '@/components/Switch/master-switch.vue'
  import ToastProvider from '@/components/Toast/toast-provider.vue'
  import AppCards from './app-cards.vue'
  import AppComp from './app-comp.vue'
  import ColorShades from './color-shades.vue'
  import ComponentManager from './component-state.vue'
  import DominantColor from './dominant-color.vue'
  import LayoutInherit from './layout-inherit.vue'

  const tab = useLocalStorage('tab', 0)
  const color = useLocalStorage('theme-color', '#386a1f')
  const isDark = useIDBStorage('dark', true)
  const colorInput = ref<HTMLInputElement>()

  provide('theme-color', color)
</script>

<template>
  <Layout
    global-style
    :options="{
      fontFamily: 'Roboto, sans-serif',
      theme: isDark ? 'dark' : 'light',
      colors: color
    }"
  >
    <template #navbar>
      <NavBar v-model="tab">
        <NavContent mt="#xl">
          <SquareImage alt="App Logo" src="/favicon.svg" :size="60" />
        </NavContent>

        <NavContainer center>
          <NavItem name="Home" icon="material-symbols:home-outline" />
          <NavItem name="Colors" icon="material-symbols:colors-sharp" />
          <NavItem name="Cards" icon="material-symbols:cards-outline" />
          <NavItem name="Layout" icon="mdi:application-outline" />
          <NavItem name="Extract" icon="mdi:palette-outline" />
          <NavItem name="Manager" icon="mdi:pencil-ruler-outline" />
          <NavEntry name="Settings" icon="mdi:cog-outline" />
        </NavContainer>
      </NavBar>
    </template>

    <template #header>
      <TopAppBar headline="App Title">
        <template #actions>
          <IconButton
            icon="material-symbols:palette-outline"
            @click="colorInput?.click()"
            :style="{ color: color }"
          />

          <input
            ref="colorInput"
            type="color"
            :defaultValue="color"
            style="opacity: 0; width: 0; height: 0; padding: 0"
            :onChange="(e: any) => (color = e.target.value)"
          />

          <IconButton icon="material-symbols:help-outline" />
        </template>
      </TopAppBar>
    </template>

    <template #fab>
      <Fab icon="material-symbols:star-outline">Fab</Fab>
    </template>

    <ToastProvider>
      <ModalProvider>
        <SnackbarProvider>
          <SheetProvider>
            <MasterSwitch v-model="isDark">Dark Mode</MasterSwitch>
            <AppComp v-if="tab === 0" />
            <ColorShades v-else-if="tab === 1" />
            <AppCards v-else-if="tab === 2" />
            <LayoutInherit v-else-if="tab === 3" />
            <DominantColor v-else-if="tab === 4" />
            <ComponentManager v-else-if="tab === 5" />
          </SheetProvider>
        </SnackbarProvider>
      </ModalProvider>
    </ToastProvider>
  </Layout>
</template>

<style lang="scss" scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--sm);
  }

  .flex {
    display: flex;
    align-items: center;
    gap: var(--sm);
  }
</style>
