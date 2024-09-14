import Actions from './card-actions.vue'
import Body from './card-body.vue'
import Head from './card-head.vue'
import Image from './card-image.vue'
import BaseCard from './card.vue'

type CardComponent = typeof BaseCard & {
  Head: typeof Head
  Body: typeof Body
  Image: typeof Image
  Actions: typeof Actions
}

export default Object.assign({}, BaseCard, {
  Head,
  Body,
  Image,
  Actions
}) as CardComponent

export { default as CardActions } from './card-actions.vue'
export { default as CardBody } from './card-body.vue'
export { default as CardHead } from './card-head.vue'
export { default as CardImage } from './card-image.vue'
export { default as CardElement } from './card.vue'
