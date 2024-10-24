<template>
  <div class="showcase">
    <!-- Buttons and Chips -->
    <div class="showcase-entry">
      <div class="showcase-entry-title">Buttons</div>
      <ButtonGroup>
        <Button variant="outlined">Button</Button>
        <Button variant="outlined">Button</Button>
        <Button variant="outlined" disabled>Button</Button>
      </ButtonGroup>
      <div class="flex">
        <Button left-icon="material-symbols:star-outline">Star</Button>
        <Button variant="outlined" left-icon="material-symbols:fullscreen">
          Fullscreen
        </Button>
        <Button variant="elevated"> See More </Button>
        <Button variant="tonal" right-icon="material-symbols:open-in-new">
          Open in new tab
        </Button>
        <Button variant="text">Text Button</Button>
      </div>
      <div class="flex">
        <IconButton icon="material-symbols:star-outline" />
        <IconButton variant="tonal" icon="mdi:fullscreen" />
        <IconButton variant="outlined" icon="mdi:open-in-new" />
        <IconButton selected icon="material-symbols:star-outline" />
        <IconButton selected variant="tonal" icon="mdi:fullscreen" />
        <IconButton selected variant="outlined" icon="mdi:open-in-new" />
      </div>

      <div class="showcase-entry-title">Chips</div>
      <ChipGroup>
        <Chip variant="outlined">Chip</Chip>
        <Chip variant="outlined">Chip</Chip>
        <Chip variant="outlined">Chip</Chip>
      </ChipGroup>
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
    </div>

    <!-- Inputs -->
    <div class="showcase-entry">
      <div class="showcase-entry-title">Inputs</div>
      <TextInput
        class="input"
        placeholder="Input"
        left-icon="material-symbols:search"
        span
        @change="(e) => console.log(e)"
        prefix="Hello"
      />
      <NumberInput
        class="input"
        placeholder="Input"
        span
        left-icon="material-symbols:monetization-on-outline-rounded"
      />
      <TextInput
        class="input"
        placeholder="Input"
        left-icon="material-symbols:search"
        span
        prefix="Hello"
        variant="outlined"
      />
      <Select placeholder="Select" span multiple :items="['one', 'two']" />
      <div class="flex">
        <Switch />
        <Switch variant="filled" />
        <Switch variant="filled" default-checked />

        <Checkbox />
        <Checkbox default-checked />
      </div>
    </div>

    <!-- Progress and Sliders -->
    <div class="showcase-entry">
      <div class="showcase-entry-title">Progress</div>
      <LinearProgress />
      <LinearProgress :value="slider" />
      <div class="flex">
        <CircularProgress />
        <CircularProgress :value="slider" />
        <CircularProgress rotate :value="80" />
        <CircularProgress>
          <CircularProgress :diameter="30" />
        </CircularProgress>
      </div>

      <div class="showcase-entry-title">Sliders</div>
      <Slider show-value v-model="slider" />
      <Slider show-value :values="[5, 15, 30, 60]" />
      <Slider show-value :values="[0, 50, 100]" show-label />
      <BlockSlider icon="material-symbols:waving-hand"> Hello </BlockSlider>
    </div>

    <!-- Images -->
    <div class="showcase-entry">
      <div class="showcase-entry-title">Images</div>

      <BlockImage
        :b-radius="4"
        span
        alt="random image"
        src="https://picsum.photos/[width]/[height]?random=4"
        :width="400"
        :height="300"
        :ratio="4 / 3"
      />

      <Scroller :spacing="0">
        <SquareImage
          alt="random image"
          src="https://picsum.photos/[size]?random=1"
        />
        <SquareImage
          alt="random image"
          frame="flower"
          src="https://picsum.photos/[size]?random=2"
        />
        <SquareImage
          frame="circle"
          alt="random image"
          src="https://picsum.photos/[size]?random=3"
        />
        <SquareImage
          alt="random image"
          frame="clover"
          src="https://picsum.photos/[size]?random=4"
        />
        <SquareImage
          alt="random image"
          frame="hexagon"
          src="https://picsum.photos/[size]?random=5"
        />
      </Scroller>
    </div>

    <!-- Dividers and Skeletons -->
    <div class="showcase-entry">
      <div class="showcase-entry-title">Dividers</div>
      <Divider />
      <Divider label="Hello" />
      <WavyDivider p="0" />

      <div class="showcase-entry-title">Skeletons</div>
      <Skeleton width="100%" :height="100" />
      <Skeleton
        >Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </Skeleton>
    </div>

    <!-- Texts -->
    <div class="showcase-entry">
      <div class="showcase-entry-title">Texts</div>

      <Text lines="2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi a
        ea natus qui aliquid error atque eveniet in temporibus placeat quam
        expedita obcaecati laborum, dolorum soluta eaque praesentium nostrum
        ab.
      </Text>
      <Scroller>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi a
        ea natus qui aliquid error atque eveniet in temporibus placeat quam
        expedita obcaecati laborum, dolorum soluta eaque praesentium nostrum
        ab.
      </Scroller>

      <Floater offset="#sm">
        <IconButton icon="material-symbols:inbox-outline-rounded" />
      </Floater>
      <Floater text="3" offset="#xxs">
        <IconButton icon="material-symbols:inbox-outline-rounded" />
      </Floater>

      <Text as="a" href="https://google.com" target="_blank">Google</Text>
    </div>

    <!-- List -->
    <div class="showcase-entry">
      <div class="showcase-entry-title">List</div>
      <List :items="['one', 'two', 'three']" sortable swipe="dismiss" />
    </div>

    <!-- Paper and Cards-->
    <div class="showcase-entry">
      <div class="showcase-entry-title">Paper</div>
      <div class="flex">
        <Paper> Hello </Paper>
        <Paper variant="outlined"> Hello </Paper>
        <Paper variant="error"> Hello </Paper>
        <Paper variant="primary"> Hello </Paper>
        <Paper variant="secondary"> Hello </Paper>
        <Paper variant="tertiary"> Hello </Paper>
      </div>

      <div class="showcase-entry-title">Cards</div>
      <div class="flex">
        <Card variant="outlined">
          <CardBody>Hello</CardBody>
        </Card>
        <Card variant="elevated">
          <CardBody>Hello</CardBody>
        </Card>
        <Card variant="filled">
          <CardBody>Hello</CardBody>
        </Card>
      </div>
    </div>

    <!-- Frames -->
    <div class="showcase-entry">
      <div class="showcase-entry-title">Frames</div>
      <div class="flex">
        <Frame> Hello </Frame>
        <Frame frame="flower"> Hello </Frame>
        <Frame frame="flower" theme="primary"> Hello </Frame>
        <Frame frame="hexagon"> Hello </Frame>
        <Frame frame="hexagon" theme="tertiary">
          <HybridIcon
            icon="material-symbols:play-arrow-outline"
            :size="48"
          />
        </Frame>
      </div>
    </div>

    <!-- Component Manager -->
    <div class="showcase-entry">
      <div class="showcase-entry-title">Components</div>
      <Snackbar
        message="Hello"
        :actions="[{ label: 'Action', onClick: () => {} }]"
      />
      <Snackbar
        message="Your cars extended warranty is about to expire, please renew!"
        :actions="[
          { label: 'Renew', onClick: () => {} },
          { label: 'Dismiss', onClick: () => {} }
        ]"
      />
      <Toast message="Successfully deleted your bank account." />
      <Toast
        variant="expanded"
        icon="material-symbols:detection-and-zone"
        :message="`An error occurred while trying to find your dad. 
          Maybe he's still looking for milk?`"
      />
    </div>

    <!-- ColorBlock -->
    <div class="showcase-entry">
      <div class="showcase-entry-title">ColorBlock</div>
      <Flex gap="0" wrap="wrap">
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
      </Flex>
      <Flex gap="0" wrap="wrap">
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
      </Flex>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Flex from '@/components/Box/Flex/flex-box.vue'
  import ButtonGroup from '@/components/Button/button-group.vue'
  import Button from '@/components/Button/button.vue'
  import IconButton from '@/components/Button/icon-button.vue'
  import CardBody from '@/components/Card/card-body.vue'
  import Card from '@/components/Card/card.vue'
  import Checkbox from '@/components/Input/checkbox.vue'
  import ChipGroup from '@/components/Chip/chip-group.vue'
  import Chip from '@/components/Chip/chip.vue'
  import Divider from '@/components/Divider/divider.vue'
  import WavyDivider from '@/components/Divider/wavy-divider.vue'
  import Frame from '@/components/Frame/frame.vue'
  import BlockImage from '@/components/Image/block-image.vue'
  import SquareImage from '@/components/Image/square-image.vue'
  import NumberInput from '@/components/Input/number.vue'
  import TextInput from '@/components/Input/text.vue'
  import List from '@/components/List/list.vue'
  import ColorBlock from '@/components/Misc/color-block.vue'
  import HybridIcon from '@/components/Misc/hybrid-icon.vue'
  import Paper from '@/components/Paper/paper.vue'
  import CircularProgress from '@/components/Progress/circular-progress.vue'
  import LinearProgress from '@/components/Progress/linear-progress.vue'
  import Select from '@/components/Select/select.vue'
  import Skeleton from '@/components/Skeleton/skeleton.vue'
  import BlockSlider from '@/components/Slider/block-slider.vue'
  import Slider from '@/components/Slider/slider.vue'
  import Snackbar from '@/components/Snackbar/snackbar.vue'
  import Switch from '@/components/Switch/switch.vue'
  import Floater from '@/components/Text/floater.vue'
  import Scroller from '@/components/Text/scroller.vue'
  import Text from '@/components/Text/text.vue'
  import Toast from '@/components/Toast/toast.vue'
  import { useLocalStorage } from '@/ref/use-local-storage'

  const slider = useLocalStorage('slider', 50)
</script>

<style lang="scss">
  *::-webkit-scrollbar {
    display: none;
  }

  .flex {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--xs);
  }

  .showcase {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--md);

    &-entry {
      display: flex;
      flex-direction: column;
      gap: var(--xxs);

      > * {
        flex-grow: 0;
      }

      &-label {
        font-size: var(--font-md);
        font-weight: 500;
      }
    }
  }
</style>
