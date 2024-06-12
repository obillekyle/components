import SquareImage from './square-image.vue'
import BlockImage from './block-image.vue'

type ImageComponent = typeof BlockImage & {
  Square: typeof SquareImage
}

const Image = BlockImage as ImageComponent
Image.Square = SquareImage

export default Image
