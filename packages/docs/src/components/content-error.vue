<script setup lang="ts">
  import { Box } from '@vue-material/core'

  const kaomojis = [
    '(╯°□°）╯︵ ┻━┻',
    String.raw`¯\_(ツ)_/¯`,
    '(ಥ﹏ಥ)',
    '(；⌣̀_⌣́)',
    '(¬_¬)',
    '(ノಠ益ಠ)ノ彡┻━┻',
    '(ノ﹏ヽ)',
    '( ≧Д≦)',
    '( ´•̥̥̥ω•̥̥̥` )',
    '｡：ﾟ(｡ﾉω＼｡)ﾟ･｡',
    '(ノಥ,_｣ಥ)',
    '(┬┬﹏┬┬)'
  ]

  function getRandomKaomoji(): string {
    const randomIndex = Math.floor(Math.random() * kaomojis.length)
    return kaomojis[randomIndex]
  }
</script>

<template>
  <Box class="content-error">
    <Text class="content-error-title" p="#md">
      {{ getRandomKaomoji() }}
    </Text>
    <Text class="content-error-description">
      The page you are looking for does not exist, yet...
    </Text>
  </Box>
</template>
