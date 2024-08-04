import BlockImage from './block-image.vue'
import SquareImage from './square-image.vue'

type ImageComponent = typeof BlockImage & {
  Square: typeof SquareImage
}

const Image = BlockImage as ImageComponent
Image.Square = SquareImage

export default Image

export { default as BlockImage } from './block-image.vue'
export { default as SquareImage } from './square-image.vue'
