import Image from './block-image.vue'
import Square from './square-image.vue'

type ImageComponent = typeof Image & {
  Square: typeof Square
}

export default Object.assign({}, Image, { Square }) as ImageComponent

export { default as BlockImage } from './block-image.vue'
export { default as SquareImage } from './square-image.vue'
