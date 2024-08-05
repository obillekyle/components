<script setup lang="ts">
  import GlobalFooter from '@/components/global-footer.vue'
  import { SquareImage, Text } from '@vue-material/core'
  import Box from '@vue-material/core/Box'
  import Button from '@vue-material/core/Button'
  import { useRouter } from 'vue-router'

  const router = useRouter()
</script>

<template>
  <Box.Flex
    gap="#xl"
    direction="row-reverse"
    justify="start"
    align="center"
    class="container"
  >
    <Box.Flex gap="#md" direction="column" class="container-logo">
      <SquareImage
        :size="200"
        frame="circle"
        src="/logo.svg"
        alt="@vue-material/core"
      />
    </Box.Flex>

    <div class="container-content">
      <Text as="h1" size="#size-xxs" wrap="balance">
        Yet Another
        <Text as="span" color="$primary-40">Material Components </Text>
        Library for Vue 3.</Text
      >

      <p>Collection of Material Components for Vue 3.</p>

      <Box.Flex gap="#xs" wrap="wrap">
        <Button
          right-icon="mdi:arrow-right"
          label="Get Started"
          @click="router.push('/docs/getting-started')"
        />
        <Button
          as="a"
          variant="tonal"
          left-icon="mdi:code-tags"
          right-icon="mdi:open-in-new"
          label="Source"
          href="https://www.github.com/obillekyle/components"
          target="_blank"
        />
      </Box.Flex>
    </div>
  </Box.Flex>

  <GlobalFooter max-width="1000px" />
</template>

<style lang="scss">
  .container {
    width: 100%;
    max-width: 1000px;
    margin-inline: auto;
    min-height: calc(100dvh - var(--navbar-size));
    padding-inline: var(--lg);
    align-content: center;

    &-logo {
      margin-inline: auto;
      filter: drop-shadow(0 0 2px var(--outline))
        drop-shadow(0 0 50px var(--primary-container))
        drop-shadow(15px 30px 20px var(--tertiary-container))
        drop-shadow(-25px -30px 10px var(--primary-container));
    }

    &-content {
      display: flex;
      max-width: 600px;
      flex-direction: column;
      gap: var(--lg);
      padding-inline: var(--xl);
      margin-right: auto;

      p {
        line-height: 1.5;
        font-size: var(--font-xl);
      }
    }
  }

  @media (width <= 900px) {
    .container {
      text-align: center;
      text-wrap: balance;
      justify-content: center !important;
      flex-direction: column !important;

      &-logo {
        margin-inline: auto;
        margin-bottom: var(--lg);

        image,
        path {
          animation-play-state: paused !important;
        }
      }

      &-content {
        z-index: 1;
        margin-inline: auto;
      }

      .md-flex {
        justify-content: center;
      }
    }
  }
</style>
