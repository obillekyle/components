<script setup lang="ts">
  import GlobalFooter from '@/components/global-footer.vue'
  import Flex from '@vue-material/core/Box/Flex/flex-box.vue'
  import Button from '@vue-material/core/Button'
  import SquareImage from '@vue-material/core/Image/square-image.vue'
  import Text from '@vue-material/core/Text/text.vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
</script>

<template>
  <div class="container">
    <div class="container-logo">
      <SquareImage
        :size="200"
        frame="circle"
        src="/logo.svg"
        alt="@vue-material/core"
      />
    </div>

    <div class="container-content">
      <h1 class="container-content-title">
        Yet Another
        <Text as="span" color="$primary-40">Material Components </Text>
        Library for Vue 3.
      </h1>

      <p>Collection of Material Components for Vue 3.</p>

      <Flex gap="#xs" wrap="wrap">
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
      </Flex>
    </div>
  </div>

  <GlobalFooter max-width="1000px" />
</template>

<style lang="scss">
  .container {
    width: 100%;
    display: flex;
    max-width: 1000px;
    margin-inline: auto;
    place-items: center;
    flex-direction: row-reverse;
    min-height: calc(100dvh - var(--navbar-size));
    padding-inline: var(--lg);

    &-logo {
      margin-inline: auto;
      filter: drop-shadow(0 0 2px var(--outline))
        drop-shadow(-25px -30px 40px var(--primary-container))
        drop-shadow(15px 30px 20px var(--tertiary-container));
    }

    &-content {
      max-width: 600px;
      gap: var(--lg);
      padding-inline: var(--xl);
      margin-right: auto;

      &-title {
        font-size: var(--component-lg);
        line-height: 1.1;
      }

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

        &-title {
          font-size: var(--component-sm);
        }
      }

      .md-flex {
        justify-content: center;
      }
    }
  }
</style>
