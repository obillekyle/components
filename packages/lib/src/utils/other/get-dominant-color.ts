import { rgba, toHex } from 'color2k'

function getSaturation(r: number, g: number, b: number): number {
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255

  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)

  const lightness = (max + min) / 2

  let saturation = 0

  if (max !== min) {
    const delta = max - min
    saturation =
      lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)
  }

  return saturation
}

export function getCanvasColor(canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available.')

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)

  const colorMap: Record<string, number> = {}
  let dominant = '255,255,255'
  let maxCount = 0

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]

    if (a < 255) continue

    const color = `${r},${g},${b}`

    const score = 0.5 + 2 * getSaturation(r, g, b)
    colorMap[color] = (colorMap[color] || 0) + score

    if (colorMap[color] > maxCount) {
      maxCount = colorMap[color]
      dominant = color
    }
  }

  const [r, g, b] = dominant.split(',').map(Number)
  return toHex(rgba(r, g, b, 1))
}

export async function getDominantColor(
  blob: Blob,
  resize = 150
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.addEventListener('load', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (ctx) {
          const ratio = img.width / img.height
          canvas.width = resize
          canvas.height = Math.max(1, resize / ratio)

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(getCanvasColor(canvas))
        } else {
          reject(new Error('Canvas context not available.'))
        }
      })

      img.addEventListener('error', () =>
        reject(new Error('Image loading error.'))
      )
    })

    reader.addEventListener('error', () =>
      reject(new Error('File reading error.'))
    )
    reader.readAsDataURL(blob)
  })
}

export function fastAvgColor(blob: Blob): Promise<string> {
  return getDominantColor(blob, 1)
}
