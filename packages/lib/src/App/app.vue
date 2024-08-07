<script setup lang="ts">
  import Headline from '@/components/AppBar/headline.vue'
  import TopAppBar from '@/components/AppBar/top-bar.vue'
  import IconButton from '@/components/Button/icon-button.vue'
  import SquareImage from '@/components/Image/square-image.vue'
  import Fab from '@/components/Layout/fab.vue'
  import Layout from '@/components/Layout/layout.vue'
  import NavBar from '@/components/Navigation/navigation-bar.vue'
  import NavContainer from '@/components/Navigation/navigation-container.vue'
  import NavContent from '@/components/Navigation/navigation-content.vue'
  import NavEntry from '@/components/Navigation/navigation-entry.vue'
  import NavItem from '@/components/Navigation/navigation-item.vue'
  import MasterSwitch from '@/components/Switch/master-switch.vue'
  import { useLocalStorage } from '@/utils/ref'
  import { ref } from 'vue'
  import AppCards from './app-cards.vue'
  import AppComp from './app-comp.vue'
  import ColorShades from './color-shades.vue'
  import LayoutInherit from './layout-inherit.vue'

  const tab = useLocalStorage('tab', 0)
  const color = useLocalStorage('theme-color', '#386a1f')
  const isDark = useLocalStorage('dark', true)
  const colorInput = ref<HTMLInputElement>()
</script>

<template>
  <Layout
    global-style
    :options="{
      fontFamily: 'Roboto, sans-serif',
      theme: isDark ? 'dark' : 'light',
      colors: {
        primary: color
      }
    }"
  >
    <template #navbar>
      <NavBar v-model="tab" labels="active">
        <NavContent mt="#xl">
          <SquareImage alt="App Logo" src="/favicon.svg" :size="60" />
        </NavContent>

        <NavContainer center>
          <NavItem name="Home" icon="material-symbols:home-outline" />
          <NavItem name="Colors" icon="material-symbols:colors-sharp" />
          <NavItem name="Cards" icon="material-symbols:cards-outline" />
          <NavItem name="Layout" icon="mdi:application-outline" />
          <NavEntry name="Settings" icon="mdi:cog-outline" />
        </NavContainer>
      </NavBar>
    </template>

    <template #header>
      <TopAppBar>
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

    <Headline title="Header Title" />
    <MasterSwitch v-model="isDark">Dark Mode</MasterSwitch>

    <AppComp v-if="tab === 0" />
    <ColorShades v-else-if="tab === 1" />
    <AppCards v-else-if="tab === 2" />
    <LayoutInherit v-else-if="tab === 3" />
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
