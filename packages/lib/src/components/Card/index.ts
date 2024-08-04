import CardActions from './card-actions.vue'
import CardBody from './card-body.vue'
import CardHead from './card-head.vue'
import CardImage from './card-image.vue'
import BaseCard from './card.vue'

type CardComponent = typeof BaseCard & {
  Head: typeof CardHead
  Body: typeof CardBody
  Image: typeof CardImage
  Actions: typeof CardActions
}

const Card = BaseCard as CardComponent

Card.Head = CardHead
Card.Body = CardBody
Card.Image = CardImage
Card.Actions = CardActions

export { default as CardActions } from './card-actions.vue'
export { default as CardBody } from './card-body.vue'
export { default as CardHead } from './card-head.vue'
export { default as CardImage } from './card-image.vue'
export { default as CardElement } from './card.vue'

export default Card
