<script setup lang="ts">
  import { useLocalStorage } from '@vue-material/core'
  import { ref, onMounted, onUnmounted, computed } from 'vue'

  import dayjs from 'dayjs'
  import ClockDigit from './clock-digit.vue'

  let interval: any = 0
  const time = ref(dayjs().unix() * 1000)

  defineOptions({ name: 'MdWidgetClock' })

  onMounted(() => {
    interval = setInterval(() => {
      time.value = dayjs().unix() * 1000
    }, 1000)
  })

  const dtConfig = useLocalStorage('widget-clock-config', {
    format: {
      time: 'h:mm',
      date: 'dddd, MMM D'
    }
  })

  const formatted = computed(() => {
    const { format } = dtConfig.value
    const now = dayjs(time.value)
    return {
      time: now.format(format.time),
      date: now.format(format.date),
      meridiem: now.format('a')
    }
  })

  onUnmounted(() => clearInterval(interval))
</script>

<template>
  <div class="md-widget-clock">
    <div class="md-clock-digits">
      <template v-for="(digit, key) of formatted.time" :key>
        <ClockDigit v-if="/[0-9]/.test(digit)" :digit />
        <span
          class="md-clock-separator md-clock-separator--colon"
          v-else-if="digit === ':'"
        />
        <span class="md-clock-separator" v-else>{{ digit }}</span>
      </template>
      <div class="md-clock-meridiems">
        <span
          class="md-clock-meridiem"
          :class="{ active: formatted.meridiem === 'am' }"
          >AM</span
        >
        <span
          class="md-clock-meridiem"
          :class="{ active: formatted.meridiem === 'pm' }"
          >PM
        </span>
      </div>
    </div>

    <div class="md-clock-date">
      {{ formatted.date }}
    </div>
  </div>
</template>

<style lang="scss">
  .md-clock-digits {
    --size: var(--component-xl);

    display: flex;
    justify-content: center;
    font-size: calc(var(--size) * 0.7);
    letter-spacing: 2px;
    height: var(--size);
    mask-image: linear-gradient(
      to bottom,
      transparent 0,
      black 20%,
      black 80%,
      transparent 100%
    );
  }

  .md-clock-meridiems {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: var(--size);
    padding-top: var(--xxs);
    margin-left: var(--sm);
    font-size: calc(var(--size) * 0.3);
  }

  .md-clock-meridiem {
    line-height: 0.95;
    opacity: 0.25;

    &.active {
      opacity: 1;
    }
  }

  .md-clock-date {
    text-align: center;
    translate: 0 calc(var(--height) * -1);
  }

  .md-clock-separator {
    display: grid;
    height: var(--size);
    place-items: center;

    &--colon::before {
      content: ':';
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0% {
        opacity: 0.5;
      }

      49% {
        opacity: 0.5;
      }

      50% {
        opacity: 1;
      }

      99% {
        opacity: 1;
      }

      100% {
        opacity: 0.5;
      }
    }
  }
</style>
