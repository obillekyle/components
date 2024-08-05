<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import {
    getCSSValue,
    Scroller,
    WavyDivider,
    type SizesString
  } from '@vue-material/core'
  import { inject, ref } from 'vue'

  type Link = {
    name: string
    url: string
  }

  defineProps<{
    maxWidth?: SizesString
  }>()

  const links: Link[] = [
    {
      name: 'NPM',
      url: 'https://www.npmjs.com/package/@vue-material/core'
    },
    {
      name: 'GitHub Repo',
      url: 'https://github.com/obillekyle/components'
    },
    {
      name: 'Material Design',
      url: 'https://m3.material.io/'
    },
    {
      name: 'Iconify Icons',
      url: 'https://iconify.design/'
    }
  ]

  const links2: Link[] = [
    {
      name: 'SLE v2',
      url: 'https://sle.okyle.xyz'
    },
    {
      name: 'Projects',
      url: 'https://okyle.xyz'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/obillekyle'
    }
  ]

  const version = inject('version', ref(''))
</script>

<template>
  <div
    class="global-footer"
    :style="{
      maxWidth: getCSSValue(maxWidth ?? 800)
    }"
  >
    <Scroller continuous :spacing="0">
      <WavyDivider :width="1656" m="0" py="#xl" p="0" />
    </Scroller>

    <div class="global-footer-grid">
      <div class="global-footer-info">
        <Icon icon="mdi:shape-outline" :width="48" />
        <h3>Material Components</h3>

        <p>
          <strong>@vue-material/core</strong> is a collection of Material
          Components for Vue. It's open source and MIT licensed.
        </p>

        <p class="global-footer-version">v{{ version }}</p>
      </div>
      <div class="global-footer-links">
        <h3>Links:</h3>
        <a
          :key="index"
          :href="link.url"
          class="global-footer-link"
          v-for="(link, index) in links"
        >
          <span>{{ link.name }}</span>
          <Icon
            v-if="link.url.startsWith('http')"
            :width="24"
            icon="mdi:arrow-top-right"
          />
        </a>
      </div>
      <div class="global-footer-links">
        <h3>See also:</h3>
        <a
          :key="index"
          :href="link.url"
          class="global-footer-link"
          v-for="(link, index) in links2"
        >
          <span>{{ link.name }}</span>
          <Icon
            v-if="link.url.startsWith('http')"
            :width="24"
            icon="mdi:arrow-top-right"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .global-footer {
    width: 100%;
    line-height: 1.5;
    max-width: 800px;
    margin-inline: auto;
    padding-inline: var(--md);
    padding-block: var(--size-xl);
    color: var(--on-surface-variant);

    &-grid {
      display: flex;
      flex-wrap: wrap;
      gap: var(--lg);
      padding-left: var(--md);
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }

    &-info {
      display: flex;
      max-width: 400px;
      flex: 1 1 auto;
      flex-direction: column;
      gap: var(--sm);
      padding-right: var(--lg);
    }

    &-links {
      display: flex;
      gap: var(--xs);
      flex-grow: 1;
      flex-direction: column;
      margin-top: var(--md);
    }

    &-link {
      display: flex;
      align-items: center;
      gap: var(--xs);
      font-weight: 500;
      line-height: 0;
      letter-spacing: 0.02em;
      color: var(--outline);
      text-decoration: none;
      width: max-content;
      transition: color 0.2s;

      span {
        margin-top: 0.1em;
      }

      &:hover {
        color: var(--primary);
      }
    }
  }
</style>
