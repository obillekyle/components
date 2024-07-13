<script setup lang="ts">
  import Layout from '@vue-material/core/Layout/layout.vue'
  import Button from '@vue-material/core/Button'
  import Input from '@vue-material/core/Input'
  import Navigation from '@vue-material/core/Navigation'
  import MdHeader from '@vue-material/core/Header/header.vue'
  import IconButton from '@vue-material/core/Button/icon-button.vue'
  import HeaderTitle from '@vue-material/core/Header/header-title.vue'
  import MasterSwitch from '@vue-material/core/Switch/master-switch.vue'
  import SquareImage from '@vue-material/core/Image/square-image.vue'
  import LinearProgress from '@vue-material/core/Progress/linear-progress.vue'
  import CircularProgress from '@vue-material/core/Progress/circular-progress.vue'
  import Chip from '@vue-material/core/Chip'
  import Select from '@vue-material/core/Select/select.vue'
  import WavyDivider from '@vue-material/core/Divider/wavy-divider.vue'
  import Scroller from '@vue-material/core/Text/scroller.vue'
  import Slider from '@vue-material/core/Slider/slider.vue'
  import Switch from '@vue-material/core/Switch/switch.vue'
  import Fab from '@vue-material/core/Layout/fab.vue'
  import MdBox from '@vue-material/core/Box'
  import BlockImage from '@vue-material/core/Image/block-image.vue'
  import Text from '@vue-material/core/Text'
  import { ref } from 'vue'

  const tab = ref(0)
  const isDark = ref(true)

  defineOptions({
    name: 'HelloWorld'
  })
</script>

<template>
  <Layout>
    <template #navbar>
      <Navigation.Bar :active="tab" :change="(t) => (tab = t)">
        <Navigation.Container center>
          <Navigation.Item
            name="Home"
            icon="material-symbols:home-outline"
          />
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
        <Button variant="outline" left-icon="material-symbols:fullscreen">
          Fullscreen
        </Button>
        <Button variant="subtle" right-icon="material-symbols:open-in-new">
          Open in new tab
        </Button>
        <Button variant="transparent">Transparent Button</Button>
      </div>

      <div class="flex">
        <Chip left-icon="material-symbols:devices-other-outline">
          Device: Mobile
        </Chip>
        <Chip variant="outline">Time: 1 week</Chip>
        <Chip variant="subtle" left-icon="material-symbols:add">
          Add Filter
        </Chip>
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

      <MdBox class="primary" p="100">Box</MdBox>
      <Text color="red" as="h1">Hello</Text>

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
          frame="clover"
          src="https://picsum.photos/[size]?random=3"
        />
        <SquareImage
          alt="random image"
          frame="hexagon"
          src="https://picsum.photos/[size]?random=4"
        />
      </div>

      <BlockImage
        :b-radius="4"
        alt="random image"
        src="https://picsum.photos/[width]/[height]?random=4"
        :width="400"
        :height="300"
        :ratio="4 / 3"
      />

      <Slider :values="[5, 15, 30, 60]" />

      <Scroller>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi a
        ea natus qui aliquid error atque eveniet in temporibus placeat quam
        expedita obcaecati laborum, dolorum soluta eaque praesentium nostrum
        ab.
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
