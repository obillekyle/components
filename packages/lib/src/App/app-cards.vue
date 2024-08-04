<template>
  <div class="card-grid">
    <Card variant="elevated">
      <CardHead header="Title" subheader="Subtitle" />
      <CardImage src="https://picsum.photos/300/200?random=6" />
      <CardBody>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </CardBody>
      <CardActions separator>
        <template #sub>
          <IconButton
            icon="material-symbols:star-outline"
            variant="standard"
          />
        </template>
        <Button>Button</Button>
      </CardActions>
    </Card>

    <Card variant="filled">
      <CardHead header="Title" subheader="Subtitle" />
      <CardImage src="https://picsum.photos/300/200?random=7" />
      <CardBody>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </CardBody>
      <CardActions separator>
        <template #sub>
          <IconButton
            icon="material-symbols:star-outline"
            variant="standard"
          />
        </template>
        <Button>Button</Button>
      </CardActions>
    </Card>

    <Card variant="outlined">
      <CardHead header="Title" subheader="Subtitle" />
      <CardImage src="https://picsum.photos/300/200?random=8" />
      <CardBody>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </CardBody>
      <CardActions separator>
        <template #sub>
          <IconButton
            icon="material-symbols:star-outline"
            variant="standard"
          />
        </template>
        <Button>Button</Button>
      </CardActions>
    </Card>
  </div>
</template>

<script setup lang="ts">
  import Button from '@/components/Button/button.vue'
  import IconButton from '@/components/Button/icon-button.vue'
  import CardActions from '@/components/Card/card-actions.vue'
  import CardBody from '@/components/Card/card-body.vue'
  import CardHead from '@/components/Card/card-head.vue'
  import CardImage from '@/components/Card/card-image.vue'
  import Card from '@/components/Card/card.vue'
</script>

<style lang="scss" scoped>
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
</style>
