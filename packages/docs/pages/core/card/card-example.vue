<script setup lang="ts">
  import Button from '@vue-material/core/Button'
  import Card from '@vue-material/core/Card'
  import BlockImage from '@vue-material/core/Image/block-image.vue'
</script>

<template>
  <Card class="my-card" variant="outlined" width="400px">
    <Card.Head header="Title" subheader="Subtitle" />
    <Card.Image
      r="0"
      :as="BlockImage"
      :width="400"
      :height="200"
      src="https://picsum.photos/400/200?random=1"
    />
    <Card.Body>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </Card.Body>
    <Card.Actions separator>
      <template #sub>
        <Button.Icon
          icon="material-symbols:star-outline"
          variant="standard"
        />
      </template>
      <Button>Button</Button>
    </Card.Actions>
  </Card>
</template>
