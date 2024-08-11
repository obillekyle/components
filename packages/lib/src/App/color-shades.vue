<script setup lang="ts">
  import Flex from '@/components/Box/Flex/flex-box.vue'
  import ScrollContainer from '@/components/Layout/scroll-container.vue'
  import ColorBlock from '@/components/Misc/color-block.vue'
</script>

<template>
  <ScrollContainer>
    <Flex gap="#xxs">
      <Flex direction="column" for="primary">
        <ColorBlock
          color="$primary"
          text="$on-primary"
          :width="250"
          :height="80"
        >
          Primary
        </ColorBlock>
        <ColorBlock color="$on-primary" text="$primary" :width="250">
          On Primary
        </ColorBlock>

        <ColorBlock
          mt="#xxs"
          color="$primary-container"
          text="$on-primary-container"
          :width="250"
          :height="80"
        >
          Primary Container
        </ColorBlock>
        <ColorBlock
          color="$on-primary-container"
          text="$primary-container"
          :width="250"
        >
          On Primary Container
        </ColorBlock>

        <Flex pt="#md">
          <ColorBlock
            color="$primary-fixed"
            text="$on-primary-fixed"
            :width="125"
            :height="80"
          >
            Primary Fixed
          </ColorBlock>
          <ColorBlock
            color="$primary-fixed-dim"
            text="$on-primary-fixed"
            :width="125"
            :height="80"
          >
            Primary Fixed Dim
          </ColorBlock>
        </Flex>

        <ColorBlock
          color="$on-primary-fixed"
          text="$primary-fixed"
          :width="250"
        >
          On Primary Fixed
        </ColorBlock>
        <ColorBlock
          color="$on-primary-fixed-variant"
          text="$primary-fixed"
          :width="250"
        >
          On Primary Fixed Variant
        </ColorBlock>
      </Flex>

      <Flex direction="column" for="secondary">
        <ColorBlock
          color="$secondary"
          text="$on-secondary"
          :width="250"
          :height="80"
        >
          Secondary
        </ColorBlock>
        <ColorBlock color="$on-secondary" text="$secondary" :width="250">
          On Secondary
        </ColorBlock>

        <ColorBlock
          mt="#xxs"
          color="$secondary-container"
          text="$on-secondary-container"
          :width="250"
          :height="80"
        >
          Secondary Container
        </ColorBlock>
        <ColorBlock
          color="$on-secondary-container"
          text="$secondary-container"
          :width="250"
        >
          On Secondary Container
        </ColorBlock>

        <Flex pt="#md">
          <ColorBlock
            color="$secondary-fixed"
            text="$on-secondary-fixed"
            :width="125"
            :height="80"
          >
            Secondary Fixed
          </ColorBlock>
          <ColorBlock
            color="$secondary-fixed-dim"
            text="$on-secondary-fixed"
            :width="125"
            :height="80"
          >
            Secondary Fixed Dim
          </ColorBlock>
        </Flex>

        <ColorBlock
          color="$on-secondary-fixed"
          text="$secondary-fixed"
          :width="250"
        >
          On Secondary Fixed
        </ColorBlock>
        <ColorBlock
          color="$on-secondary-fixed-variant"
          text="$secondary-fixed"
          :width="250"
        >
          On Secondary Fixed Variant
        </ColorBlock>
      </Flex>

      <Flex direction="column" for="tertiary">
        <ColorBlock
          color="$tertiary"
          text="$on-tertiary"
          :width="250"
          :height="80"
        >
          Tertiary
        </ColorBlock>
        <ColorBlock color="$on-tertiary" text="$tertiary" :width="250">
          On Tertiary
        </ColorBlock>

        <ColorBlock
          mt="#xxs"
          color="$tertiary-container"
          text="$on-tertiary-container"
          :width="250"
          :height="80"
        >
          Tertiary Container
        </ColorBlock>
        <ColorBlock
          color="$on-tertiary-container"
          text="$tertiary-container"
          :width="250"
        >
          On Tertiary Container
        </ColorBlock>

        <Flex pt="#md">
          <ColorBlock
            color="$tertiary-fixed"
            text="$on-tertiary-fixed"
            :width="125"
            :height="80"
          >
            Tertiary Fixed
          </ColorBlock>
          <ColorBlock
            color="$tertiary-fixed-dim"
            text="$on-tertiary-fixed"
            :width="125"
            :height="80"
          >
            Tertiary Fixed Dim
          </ColorBlock>
        </Flex>

        <ColorBlock
          color="$on-tertiary-fixed"
          text="$tertiary-fixed"
          :width="250"
        >
          On Tertiary Fixed
        </ColorBlock>
        <ColorBlock
          color="$on-tertiary-fixed-variant"
          text="$tertiary-fixed"
          :width="250"
        >
          On Tertiary Fixed Variant
        </ColorBlock>
      </Flex>

      <Flex ml="#md" direction="column" for="error">
        <ColorBlock
          color="$error"
          text="$on-error"
          :width="250"
          :height="80"
        >
          Error
        </ColorBlock>
        <ColorBlock color="$on-error" text="$error" :width="250">
          On Error
        </ColorBlock>

        <ColorBlock
          mt="#xxs"
          color="$error-container"
          text="$on-error-container"
          :width="250"
          :height="80"
        >
          Error Container
        </ColorBlock>
        <ColorBlock
          color="$on-error-container"
          text="$error-container"
          :width="250"
        >
          On Error Container
        </ColorBlock>
      </Flex>
    </Flex>

    <Flex gap="#md" mt="#md" width="fit-content">
      <Flex for="surfaces" direction="column" :width="760" gap="xxs">
        <Flex for="shades">
          <ColorBlock :height="80" span color="$surface-dim">
            Surface Dim
          </ColorBlock>
          <ColorBlock :height="80" span color="$surface">
            Surface
          </ColorBlock>
          <ColorBlock :height="80" span color="$surface-bright">
            Surface Bright
          </ColorBlock>
        </Flex>

        <Flex for="container" span>
          <ColorBlock span height="auto" color="$surface-container-lowest">
            Surface Container Lowest
          </ColorBlock>
          <ColorBlock span height="auto" color="$surface-container-low">
            Surface Container Low
          </ColorBlock>
          <ColorBlock span height="auto" color="$surface-container">
            Surface Container
          </ColorBlock>
          <ColorBlock span height="auto" color="$surface-container-high">
            Surface Container High
          </ColorBlock>
          <ColorBlock span height="auto" color="$surface-container-highest">
            Surface Container Highest
          </ColorBlock>
        </Flex>

        <Flex for="other" span>
          <ColorBlock
            span
            text="$surface-container-lowest"
            color="$on-surface"
          >
            On Surface
          </ColorBlock>
          <ColorBlock
            span
            text="$surface-container-lowest"
            color="$on-surface-variant"
          >
            On Surface Variant
          </ColorBlock>
          <ColorBlock
            span
            text="$surface-container-lowest"
            color="$outline"
          >
            Outline
          </ColorBlock>
          <ColorBlock span text="$neutral-0" color="$outline-variant">
            Outline Variant
          </ColorBlock>
        </Flex>
      </Flex>

      <Flex :width="250" direction="column" gap="xxs">
        <ColorBlock
          width="100%"
          color="$inverse-surface"
          text="$inverse-on-surface"
        >
          Inverse Surface
        </ColorBlock>
        <ColorBlock
          width="100%"
          color="$inverse-on-surface"
          text="$inverse-surface"
        >
          Inverse On Surface
        </ColorBlock>
        <ColorBlock
          width="100%"
          color="$inverse-primary"
          text="$on-primary-container"
        >
          Inverse Primary
        </ColorBlock>

        <Flex width="100%" mt="auto" gap="#md">
          <ColorBlock span color="$scrim" text="white"> Scrim </ColorBlock>
          <ColorBlock span color="$shadow" text="white">
            Shadow
          </ColorBlock>
        </Flex>
      </Flex>
    </Flex>
  </ScrollContainer>
</template>

<style lang="scss">
  .md-color-block {
    font-weight: 500;
    letter-spacing: 0.02em;
  }
</style>
