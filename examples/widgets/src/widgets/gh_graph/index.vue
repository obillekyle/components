<script setup lang="ts">
  import {
    mapNumberToRange,
    useLocalStorage,
    useTooltip
  } from '@vue-material/core'
  import { ref, onMounted, onUnmounted } from 'vue'
  import { Icon } from '@iconify/vue'
  import dayjs from 'dayjs'

  let interval: any = 0

  const loading = ref(false)
  const gh_token = import.meta.env.VITE_GITHUB_TOKEN
  const username = import.meta.env.VITE_GITHUB_USERNAME

  const user = useLocalStorage('username', username)

  const commitGraph = ref(
    Array.from({ length: 53 }, () => [0, 0, 0, 0, 0, 0, 0])
  )

  async function fetchInfo() {
    loading.value = true
    const query = `
    query {
      user(login: "${user.value}") {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                weekday
                contributionCount
              }
            }
          }
        }
      }
    }`

    const req = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${gh_token}`
      },
      body: JSON.stringify({ query })
    })

    type Weeks = {
      contributionDays: {
        weekday: number
        contributionCount: number
      }[]
    }

    if (req.ok) {
      const data = await req.json()
      const newGraph = Array.from({ length: 53 }, () => [
        0, 0, 0, 0, 0, 0, 0
      ])

      const weeks: Weeks[] =
        data.data.user.contributionsCollection.contributionCalendar.weeks

      for (const [i, week] of weeks.entries()) {
        for (const day of week.contributionDays) {
          newGraph[i][day.weekday] = day.contributionCount
        }
      }

      loading.value = false
      commitGraph.value = newGraph
    }
  }

  const calendar = ref<HTMLElement>()
  useTooltip(calendar, 'contributions')

  onMounted(() => {
    fetchInfo()
    interval = setInterval(fetchInfo, 600_000)

    if (calendar.value) {
      calendar.value.scrollLeft = calendar.value.scrollWidth
    }
  })

  const year = dayjs().year()
  const todayOffset = dayjs().day()

  // function getDate(week: number, day = 0) {
  //   const firstDayOfYear = dayjs(`${year}-01-01`)

  //   const firstWeekStart = firstDayOfYear.day(1).add((week - 1) * 7, 'day')
  //   const targetDate = firstWeekStart.day(day)

  //   return targetDate
  // }

  onUnmounted(() => clearInterval(interval))
  defineOptions({ name: 'MdWidgetGhGraph' })
</script>

<template>
  <div class="md-widget-gh-graph">
    <div class="md-gh-contribution-header">
      <Icon icon="carbon:calendar" :width="24" />
      <span>{{ year }}</span>
      <Icon
        icon="carbon:renew"
        :width="24"
        class="md-gh-contribution-refresh"
        :class="{ loading }"
        @click="fetchInfo"
      />
    </div>
    <div class="md-gh-contribution-calendar" ref="calendar">
      <div
        :key
        class="md-gh-contribution-week"
        v-for="(week, key) of commitGraph"
      >
        <template v-for="(count, day) of week" :key="day">
          <div
            class="md-gh-contribution-day"
            :style="`opacity: ${count ? mapNumberToRange(count, 0, 10, 0.3, 1) : 0.1}`"
            v-if="!(key === commitGraph.length - 1 && day > todayOffset)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .md-gh-contribution-calendar {
    display: flex;
    overflow-x: auto;

    &::-webkit-scrollbar {
      height: var(--xs);

      &-thumb {
        background: var(--surface-container);
      }
    }
  }

  .md-gh-contribution-header {
    display: flex;
    align-items: center;
    gap: var(--xs);
    margin-bottom: var(--xs);
  }

  .md-gh-contribution-refresh {
    cursor: pointer;
    margin-left: auto;

    &.loading {
      animation: spin 2s linear infinite reverse;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  }

  .md-gh-contribution-week {
    display: grid;
    grid-template-rows: repeat(7, 1fr);
  }

  .md-gh-contribution-day {
    width: var(--sm);
    height: var(--sm);
    margin: 2px;
    border-radius: 2px;
    background: var(--primary);
  }
</style>
