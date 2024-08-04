<script setup lang="ts">
  import { SquareImage } from '@vue-material/core'
  import Box from '@vue-material/core/Box'
  import Button from '@vue-material/core/Button'
  import { useRouter } from 'vue-router'

  const router = useRouter()
</script>

<template>
  <Box.Flex pt="#xl" gap="#xl" direction="column" class="container">
    <SquareImage
      :size="125"
      src="https://raw.githubusercontent.com/obillekyle/components/main/assets/logo.png"
      alt="@vue-material/core"
    />

    <h1>Material Components for Vue</h1>

    <p>Yet another Material Design Component library for vue 3</p>

    <Box.Flex gap="#xs">
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
  </Box.Flex>
</template>

<style lang="scss" scoped>
  .container {
    width: 100%;
    max-width: 1000px;
    margin-inline: auto;
    padding-inline: var(--lg);
  }
</style>
