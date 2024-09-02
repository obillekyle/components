import { toHex } from 'color2k'

export function fastAvgColor(src: Blob | string): Promise<string> {
  return new Promise((resolve) => {
    const image = new Image()
    const isBlob = src instanceof Blob

    image.src = isBlob ? URL.createObjectURL(src) : src

    image.addEventListener('load', () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(image, 0, 0, 1, 1)

      const imageData = ctx.getImageData(0, 0, 1, 1)
      const [r, g, b] = imageData.data
      resolve(toHex(`rgb(${r}, ${g}, ${b})`))

      isBlob && URL.revokeObjectURL(image.src)
    })
  })
}
