<script setup lang="ts">
  defineProps<{ digit: number | string }>()
</script>

<template>
  <div class="md-clock-digit" :style="`--digit: ${digit}`">
    <div class="md-clock-digit-number">0</div>
    <div class="md-clock-digit-number">1</div>
    <div class="md-clock-digit-number">2</div>
    <div class="md-clock-digit-number">3</div>
    <div class="md-clock-digit-number">4</div>
    <div class="md-clock-digit-number">5</div>
    <div class="md-clock-digit-number">6</div>
    <div class="md-clock-digit-number">7</div>
    <div class="md-clock-digit-number">8</div>
    <div class="md-clock-digit-number">9</div>
  </div>
</template>

<style lang="scss">
  .md-clock-digit {
    transition: transform 0.2s;
    transform: translateY(calc(var(--digit) * (var(--size) * -1)));

    &-number {
      height: var(--size);
      display: grid;
      place-items: center;
    }
  }
</style>
