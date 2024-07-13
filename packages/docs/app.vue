<script setup lang="ts">
  import Layout from '@vue-material/core/Layout/layout.vue'
  import Navigation from '@vue-material/core/Navigation'

  const router = useRouter()

  const routes = [
    {
      icon: 'material-symbols:home-outline',
      path: '/',
      name: 'Home'
    },
    {
      icon: 'mdi:bookmark-box-multiple-outline',
      path: '/components',
      name: 'Components'
    }
  ]

  const currentTab = computed(() => {
    if (router.currentRoute.value.path === '/') {
      return 0
    }

    return routes.findIndex((r) => {
      router.currentRoute.value.path.startsWith(r.path)
    })
  })
</script>

<template>
  <Layout>
    <template #navbar>
      <Navigation.Bar
        :active="currentTab"
        :change="(p) => router.push(routes[p].path)"
      >
        <Navigation.Container center>
          <Navigation.Item
            v-for="(r, key) in routes"
            :key="r.path"
            :value="key"
            :name="r.name"
            :icon="r.icon"
          />
        </Navigation.Container>
      </Navigation.Bar>
    </template>

    <NuxtRouteAnnouncer />
    <NuxtPage />
  </Layout>
</template>
