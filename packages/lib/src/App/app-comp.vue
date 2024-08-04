<template>
  <div class="wrapper">
    <div class="flex">
      <Button.Group>
        <Button variant="outlined">Button</Button>
        <Button variant="outlined">Button</Button>
        <Button variant="outlined" disabled>Button</Button>
      </Button.Group>

      <Chip.Group>
        <Chip variant="outlined">Chip</Chip>
        <Chip variant="outlined">Chip</Chip>
        <Chip variant="outlined">Chip</Chip>
      </Chip.Group>
    </div>

    <div class="flex">
      <Button left-icon="material-symbols:star-outline">Star</Button>
      <Button variant="outlined" left-icon="material-symbols:fullscreen">
        Fullscreen
      </Button>
      <Button variant="tonal" right-icon="material-symbols:open-in-new">
        Open in new tab
      </Button>
      <Button variant="text">Transparent Button</Button>
    </div>

    <div class="flex">
      <Chip left-icon="material-symbols:devices-other-outline">
        Device: Mobile
      </Chip>
      <Chip variant="outlined">Time: 1 week</Chip>
      <Chip variant="tonal">Audiences: 100k</Chip>
      <Chip variant="text" left-icon="material-symbols:add">
        Add Filter
      </Chip>
    </div>
    <div class="flex">
      <Input
        class="input"
        placeholder="Input"
        left-icon="material-symbols:search"
        span
        prefix="Hello"
      />
      <Input.Number
        class="input"
        placeholder="Input"
        span
        left-icon="material-symbols:monetization-on-outline-rounded"
      />
      <Input
        class="input"
        placeholder="Input"
        left-icon="material-symbols:search"
        span
        prefix="Hello"
        variant="outlined"
      />
      <Select placeholder="Select" span :items="['one', 'two']" />
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

    <Text color="$primary" as="h1">Hello</Text>

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

    <Slider show-value :values="[5, 15, 30, 60]" />

    <BlockSlider> Hello </BlockSlider>

    <Scroller>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi a ea
      natus qui aliquid error atque eveniet in temporibus placeat quam
      expedita obcaecati laborum, dolorum soluta eaque praesentium nostrum
      ab.
    </Scroller>

    <WavyDivider />

    <Box.Flex>
      <ColorBlock color="$primary" />
      <ColorBlock color="$primary-1" />
      <ColorBlock color="$primary-5" />
      <ColorBlock color="$primary-10" />
      <ColorBlock color="$primary-20" />
      <ColorBlock color="$primary-30" />
      <ColorBlock color="$primary-40" />
      <ColorBlock color="$primary-50" />
      <ColorBlock color="$primary-60" />
      <ColorBlock color="$primary-70" />
      <ColorBlock color="$primary-80" />
      <ColorBlock color="$primary-90" />
      <ColorBlock color="$primary-95" />
      <ColorBlock color="$primary-99" />
      <ColorBlock color="$primary-100" />
    </Box.Flex>

    <Box.Flex>
      <ColorBlock color="$secondary" />
      <ColorBlock color="$secondary-1" />
      <ColorBlock color="$secondary-5" />
      <ColorBlock color="$secondary-10" />
      <ColorBlock color="$secondary-20" />
      <ColorBlock color="$secondary-30" />
      <ColorBlock color="$secondary-40" />
      <ColorBlock color="$secondary-50" />
      <ColorBlock color="$secondary-60" />
      <ColorBlock color="$secondary-70" />
      <ColorBlock color="$secondary-80" />
      <ColorBlock color="$secondary-90" />
      <ColorBlock color="$secondary-95" />
      <ColorBlock color="$secondary-99" />
      <ColorBlock color="$secondary-100" />
    </Box.Flex>

    <BlockImage
      :b-radius="4"
      alt="random image"
      src="https://picsum.photos/[width]/[height]?random=4"
      :width="400"
      :height="300"
      :ratio="4 / 3"
    />
  </div>
</template>

<script setup lang="ts">
  import { default as Box } from '@/components/Box'
  import Button from '@/components/Button'
  import Chip from '@/components/Chip'
  import WavyDivider from '@/components/Divider/wavy-divider.vue'
  import BlockImage from '@/components/Image/block-image.vue'
  import SquareImage from '@/components/Image/square-image.vue'
  import Input from '@/components/Input'
  import ColorBlock from '@/components/Misc/color-block.vue'
  import CircularProgress from '@/components/Progress/circular-progress.vue'
  import LinearProgress from '@/components/Progress/linear-progress.vue'
  import Select from '@/components/Select/select.vue'
  import BlockSlider from '@/components/Slider/block-slider.vue'
  import Slider from '@/components/Slider/slider.vue'
  import Switch from '@/components/Switch/switch.vue'
  import Text from '@/components/Text'
  import Scroller from '@/components/Text/scroller.vue'
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
    align-items: center;
    gap: var(--sm);
  }
</style>
