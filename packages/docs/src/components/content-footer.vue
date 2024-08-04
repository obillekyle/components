<script setup lang="ts">
  import pages, { type Page } from '@/router/pages'
  import { Icon } from '@iconify/vue'
  import { toCamelCase, toKebabCase } from '@vue-material/core'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  type PageWithKey = Page & { key: string }

  const params = computed(() => (route.params.content as string[]) ?? [])

  const prev = computed<PageWithKey | undefined>(() => {
    const [page, subpage] = params.value as string[]
    const docs = pages[page].pages ?? {}
    const keys = Object.keys(docs ?? {})

    if (subpage) {
      const index = keys.indexOf(toCamelCase(subpage)) - 1
      const key = keys[index]
      const data = docs[String(key)]

      return data ? { key: toKebabCase(key), ...data } : undefined
    }

    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined
  })

  const next = computed<PageWithKey | undefined>(() => {
    const [page, subpage] = params.value
    const docs = pages[page].pages ?? {}
    const keys = Object.keys(docs)

    let key: string | undefined

    if (subpage) {
      const index = keys.indexOf(toCamelCase(subpage))
      if (index < 0) return

      key = keys[index + 1] || ''
    }

    const data = docs[key ?? keys[0]]
    return data ? { key: toKebabCase(key ?? keys[0]), ...data } : undefined
  })
</script>

<template>
  <div class="content-footer">
    <div
      v-if="prev"
      class="content-footer-btn prev"
      @click="router.push(`/${params[0]}/${prev.key}`)"
    >
      <div class="content-footer-text">
        <Icon icon="material-symbols:chevron-left" :width="24" />
        <span>Previous</span>
      </div>

      <div class="content-footer-info">
        <Icon :icon="prev.icon" :width="24" />
        <span>{{ prev.name }}</span>
      </div>
    </div>

    <div
      v-if="next"
      class="content-footer-btn next"
      @click="router.push(`/${params[0]}/${next.key}`)"
    >
      <div class="content-footer-text">
        <span>Next</span>
        <Icon icon="material-symbols:chevron-right" :width="24" />
      </div>

      <div class="content-footer-info">
        <Icon :icon="next.icon" :width="24" />
        <span>{{ next.name }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .content-footer {
    display: flex;
    padding-block: var(--component-xl);
    user-select: none;
    gap: var(--sm);

    &-btn {
      border-radius: var(--xs);
      border: 1px solid var(--primary-80);
      background: var(--surface-container-low);
      cursor: pointer;
      width: 200px;
      transition:
        background-color 0.2s,
        color 0.2s;

      &.next {
        margin-left: auto;
      }

      &:hover {
        background: var(--primary-container);
        color: var(--on-primary-container);
      }
    }

    &-text {
      display: flex;
      align-items: center;
      padding-inline: var(--xs);
      justify-content: space-between;

      span {
        padding: var(--xs) var(--xs);
      }
    }

    &-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: var(--sm) var(--md);

      span {
        padding-top: 2px;
      }
    }
  }
</style>
