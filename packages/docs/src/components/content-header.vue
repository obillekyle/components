<script setup lang="ts">
  import type { MetaOptions } from './content-utils'

  import { Box, Chip } from '@vue-material/core'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  const props = defineProps<{
    meta: MetaOptions
  }>()

  function getSourceLink(source?: string): string | undefined {
    if (!source) return undefined
    return `https://github.com/obillekyle/components/tree/main/${source}`
  }

  const inherits = computed(() => {
    const inherits = props.meta.inherits
    if (!inherits || inherits.length === 0) return

    const link = `/${inherits[0]}`
    const title =
      inherits[0] +
      (inherits.length > 1 ? `, ${inherits.length - 1} more` : '')

    return {
      link,
      title
    }
  })

  const router = useRouter()
</script>

<template>
  <div class="content-header">
    <h1 class="content-title">{{ meta.title }}</h1>
    <p class="content-description">{{ meta.description }}</p>
    <Box class="content-links">
      <Chip
        v-if="inherits"
        @click="router.push(inherits.link)"
        left-icon="material-symbols:extension-outline"
        variant="tonal"
        r="#xs"
      >
        {{ inherits.title }}
      </Chip>

      <Chip
        as="a"
        v-if="meta.source"
        :href="getSourceLink(meta.source)"
        left-icon="material-symbols:code"
        variant="outlined"
        r="#xs"
      >
        Source
      </Chip>
    </Box>
  </div>
</template>
