<script setup lang="ts">
  import Divider from '@/components/Divider/divider.vue'
  import TextInput from '@/components/Input/text.vue'
</script>

<template>
  <TextInput span variant="outlined" placeholder="Name" />
  <TextInput span variant="outlined" placeholder="Email" />

  <Divider margin="#sm" />

  <TextInput span variant="outlined" placeholder="House Number" />
  <TextInput span variant="outlined" placeholder="Street" />
  <TextInput span variant="outlined" placeholder="City" />
  <TextInput span variant="outlined" placeholder="Province/State" />
  <TextInput span variant="outlined" placeholder="Country" />
  <TextInput span variant="outlined" placeholder="Zip" />
</template>
