/* eslint-disable unicorn/prefer-add-event-listener */
import { rgba, toHex } from 'color2k'

class ImagePalette {
  private colorMap: Map<string, number> = new Map<string, number>()

  private constructor(private readonly canvas: HTMLCanvasElement) {
    this.colorMap = this.processColors()
  }

  private static async createCanvas(
    src: Blob | string,
    resize: number
  ): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context not available.'))

      const isBlob = src instanceof Blob

      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        const ratio = img.width / img.height
        canvas.width = resize
        canvas.height = Math.max(1, resize / ratio)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        isBlob && URL.revokeObjectURL(img.src)
        resolve(canvas)
      }

      img.onerror = () => {
        isBlob && URL.revokeObjectURL(img.src)
        reject(new Error('Image loading error.'))
      }

      img.src = isBlob ? URL.createObjectURL(src) : src
    })
  }

  private static getVibrance(r: number, g: number, b: number): number {
    r /= 255
    g /= 255
    b /= 255

    return Math.max(r, g, b) - Math.min(r, g, b)
  }

  private findOrMerge(
    colorMap: Map<string, number>,
    r: number,
    g: number,
    b: number,
    threshold: number
  ): string {
    for (const color of colorMap.keys()) {
      const [r2, g2, b2] = color.split(',').map(Number)
      const colorDistance = Math.hypot(r - r2, g - g2, b - b2)
      if (colorDistance < threshold) return color
    }
    return `${r},${g},${b}`
  }

  private processColors(): Map<string, number> {
    const ctx = this.canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available.')

    const { data } = ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    )
    const colorMap = new Map<string, number>()
    const threshold = 60

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]

      if (a < 255) continue // Ignore transparent pixels

      const color = this.findOrMerge(colorMap, r, g, b, threshold)
      const vibrance = ImagePalette.getVibrance(r, g, b)
      const score = (colorMap.get(color) || 0) + vibrance
      colorMap.set(color, score)
    }

    return colorMap
  }

  public get dominant(): string {
    let dominant = '255,255,255'
    let maxScore = 0

    for (const [color, score] of this.colorMap) {
      if (score > maxScore) {
        maxScore = score
        dominant = color
      }
    }

    const [r, g, b] = dominant.split(',').map(Number)
    return toHex(rgba(r, g, b, 1))
  }

  public top(count: number): string[] {
    const sortedColors = [...this.colorMap].sort((a, b) => b[1] - a[1])
    return sortedColors.slice(0, count).map(([color]) => {
      const [r, g, b] = color.split(',').map(Number)
      return toHex(rgba(r, g, b, 1))
    })
  }

  public static async from(
    blobOrSrc: Blob | string,
    resize: number = 150
  ): Promise<ImagePalette> {
    const canvas = await ImagePalette.createCanvas(blobOrSrc, resize)
    return new ImagePalette(canvas)
  }
}

export { ImagePalette }
