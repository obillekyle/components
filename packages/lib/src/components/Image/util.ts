export async function resolveImage(
  source: string | Blob,
  progress: (v: number) => void
): Promise<Blob> {
  if (typeof source === 'string') {
    progress(Infinity)
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'arraybuffer'
    xhr.open('GET', source)

    xhr.addEventListener('progress', (event) => {
      const value = event.total
        ? Math.floor((event.loaded / event.total) * 100)
        : Infinity
      progress(value)
    })

    xhr.send()

    const data = await new Promise<Blob | undefined>((resolve) => {
      xhr.addEventListener('error', () => resolve(void 0))
      xhr.addEventListener('load', () => {
        const contentType =
          xhr.getResponseHeader('content-type') || 'image/webp'
        resolve(new Blob([xhr.response || ''], { type: contentType }))
      })
    })

    if (!data) {
      throw new Error('Failed to load image')
    }

    return data
  } else {
    return new Blob([source])
  }
}
