<script setup lang="ts">
  import Flex from '@vue-material/core/Box/Flex'
  import Slider from '@vue-material/core/Slider/slider.vue'
</script>

<template>
  <Flex gap="#xs" p="#md" direction="column" width="100%">
    Default w/ show-value
    <Slider show-value />
    min max
    <Slider :min="15" :max="50" />
    Preset values
    <Slider :values="[10, 20, 25, 30, 41]" />
    Preset values, unsorted w/ show-label
    <Slider :values="[600, 100, 120, 400, 300]" show-label />
    Step
    <Slider :step="5" />
  </Flex>
</template>
