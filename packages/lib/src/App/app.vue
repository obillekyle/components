<script setup lang="ts">
  import { customRef, useLocalStorage } from '@/utils/ref'
  import { useTooltip } from '@/utils/ref/use-tooltip'
  import { ref } from 'vue'

  import Headline from '@/components/AppBar/headline.vue'
  import TopAppBar from '@/components/AppBar/top-bar.vue'
  import Button from '@/components/Button/button.vue'
  import IconButton from '@/components/Button/icon-button.vue'
  import SquareImage from '@/components/Image/square-image.vue'
  import Fab from '@/components/Layout/fab.vue'
  import Layout from '@/components/Layout/layout.vue'
  import NavBar from '@/components/Navigation/navigation-bar.vue'
  import NavContainer from '@/components/Navigation/navigation-container.vue'
  import NavContent from '@/components/Navigation/navigation-content.vue'
  import NavEntry from '@/components/Navigation/navigation-entry.vue'
  import NavItem from '@/components/Navigation/navigation-item.vue'
  import { useSnackbar } from '@/components/Snackbar/snackbar-manager'
  import SnackbarProvider from '@/components/Snackbar/snackbar-provider.vue'
  import MasterSwitch from '@/components/Switch/master-switch.vue'
  import AppCards from './app-cards.vue'
  import AppComp from './app-comp.vue'
  import ColorShades from './color-shades.vue'
  import DominantColor from './dominant-color.vue'
  import LayoutInherit from './layout-inherit.vue'
  import Test from './test.vue'

  const tab = useLocalStorage('tab', 0)
  const color = useLocalStorage('theme-color', '#386a1f')
  const isDark = useLocalStorage('dark', true)
  const colorInput = ref<HTMLInputElement>()
  const [root, setRoot] = customRef<HTMLElement>()

  const manager = useSnackbar()

  useTooltip(root, ['title', 'alt', 'class'])

  function openSnackbar() {
    manager.open({
      message:
        'Hello World! Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, reprehenderit et. Impedit aperiam neque laborum aliquid officia veniam quo voluptatibus quas ratione ex, doloribus facilis omnis quaerat eos ab culpa.',
      closeable: true,
      timeout: Infinity,
      actions: [
        {
          label: 'Action 1',
          action: () => {
            console.log('Action 1')
          }
        },
        {
          label: 'Action 2',
          action: () => {
            console.log('Action 2')
          }
        }
      ]
    })
  }
</script>

<template>
  <Layout
    global-style
    :ref="setRoot"
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
          <NavItem name="Extract" icon="mdi:palette-outline" />
          <NavItem name="Test" icon="mdi:pencil-ruler-outline" />
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

    <SnackbarProvider :manager>
      <Headline title="Header Title" />
      <MasterSwitch v-model="isDark">Dark Mode</MasterSwitch>
      <AppComp v-if="tab === 0" />
      <ColorShades v-else-if="tab === 1" />
      <AppCards v-else-if="tab === 2" />
      <LayoutInherit v-else-if="tab === 3" />
      <DominantColor v-else-if="tab === 4" />
      <Test text="test" v-else-if="tab === 5">
        <Button @click="openSnackbar">Click me</Button>
      </Test>
    </SnackbarProvider>
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
