<script setup lang="ts">
  import Layout from '@/components/Layout/layout.vue'
  import Button from '../components/Button'
  import Input from '../components/Input'
  import Navigation from '@/components/Navigation'
  import MdHeader from '@/components/Header/header.vue'
  import IconButton from '@/components/Button/icon-button.vue'
  import { ref } from 'vue'
  import HeaderTitle from '@/components/Header/header-title.vue'
  import MasterSwitch from '@/components/Switch/master-switch.vue'
  import SquareImage from '@/components/square-image.vue'
  import LinearProgress from '@/components/Progress/linear-progress.vue'
  import CircularProgress from '@/components/Progress/circular-progress.vue'
  import Chip from '@/components/Chip'
  import Select from '@/components/Select/select.vue'
  import WavyDivider from '@/components/Divider/wavy-divider.vue'
  import Scroller from '@/components/Text/scroller.vue'
  import Slider from '@/components/Slider/slider.vue'
  import Switch from '@/components/Switch/switch.vue'
  import Fab from '@/components/Layout/fab.vue'

  const tab = ref(0)
  const isDark = ref(true)
</script>

<template>
  <Layout :options="{ theme: isDark ? 'dark' : 'light' }">
    <template #navbar>
      <Navigation.Bar :active="tab" :change="(t) => (tab = t)">
        <Navigation.Container center>
          <Navigation.Item name="Home" icon="material-symbols:home-outline" />
          <Navigation.Item
            name="Library"
            icon="material-symbols:library-books-outline"
          />
        </Navigation.Container>
      </Navigation.Bar>
    </template>

    <template #header>
      <MdHeader>
        <template #actions>
          <IconButton icon="material-symbols:help-outline" />
        </template>
      </MdHeader>
    </template>

    <template #fab>
      <Fab icon="material-symbols:star-outline">Fab</Fab>
    </template>

    <div class="wrapper">
      <HeaderTitle title="Header Title" />
      <MasterSwitch v-model="isDark">Dark Mode</MasterSwitch>
      <div class="flex">
        <Button.Group>
          <Button variant="outline">Button</Button>
          <Button variant="outline">Button</Button>
          <Button variant="outline">Button</Button>
        </Button.Group>

        <Chip.Group>
          <Chip variant="outline">Chip</Chip>
          <Chip variant="outline">Chip</Chip>
          <Chip variant="outline">Chip</Chip>
        </Chip.Group>
      </div>

      <div class="flex">
        <Button left-icon="material-symbols:star-outline">Star</Button>
        <Button variant="outline" left-icon="material-symbols:fullscreen"
          >Fullscreen</Button
        >
        <Button variant="subtle" right-icon="material-symbols:open-in-new"
          >Open in new tab</Button
        >
        <Button variant="transparent">Transparent Button</Button>
      </div>

      <div class="flex">
        <Chip left-icon="material-symbols:devices-other-outline">
          Device: Mobile
        </Chip>
        <Chip variant="outline">Time: 1 week</Chip>
        <Chip variant="subtle" left-icon="material-symbols:add"
          >Add Filter</Chip
        >
      </div>
      <div class="flex">
        <Input
          class="input"
          placeholder="Input"
          left-icon="material-symbols:search"
        />
        <Input.Number
          class="input"
          placeholder="Input"
          left-icon="material-symbols:monetization-on-outline-rounded"
        />
        <Select placeholder="Select" span />
      </div>
      <LinearProgress />
      <LinearProgress :value="20" />

      <div class="flex">
        <CircularProgress />
        <CircularProgress :value="20" />
        <CircularProgress rotate :value="80" />
        <Switch />
        <Switch variant="filled" />
        <Switch variant="filled" default-checked />
      </div>

      <div class="flex">
        <SquareImage
          frame="circle"
          alt="random image"
          src="https://picsum.photos/[size]?random=1"
        />
        <SquareImage
          frame="default"
          alt="random image"
          src="https://picsum.photos/[size]?random=2"
        />
        <SquareImage
          alt="random image"
          frame="scalloped-square"
          src="https://picsum.photos/[size]?random=3"
        />
      </div>

      <Slider :values="[5, 15, 30, 60]" />

      <Scroller>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi a ea
        natus qui aliquid error atque eveniet in temporibus placeat quam
        expedita obcaecati laborum, dolorum soluta eaque praesentium nostrum ab.
      </Scroller>

      <WavyDivider />
    </div>
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
