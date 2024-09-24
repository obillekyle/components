<script setup lang="ts">
  import {
    BlockImage,
    IconButton,
    Layout,
    TopAppBar
  } from '@vue-material/core'
  import { inject, ref } from 'vue'

  const opts = inject('options', ref({} as any))
</script>

<template>
  <Layout
    :options="{
      theme: opts.theme || 'light',
      colors: {
        primary: 'orange'
      }
    }"
  >
    <template #header>
      <TopAppBar headline="App Title">
        <IconButton icon="material-symbols:menu" />
        <template #actions>
          <IconButton icon="mdi:dots-vertical" />
        </template>
      </TopAppBar>
    </template>

    <h2 class="info">These are the apps contents</h2>
    <BlockImage
      :ratio="3 / 2"
      src="https://picsum.photos/300/200?random=1"
    />
  </Layout>
</template>
