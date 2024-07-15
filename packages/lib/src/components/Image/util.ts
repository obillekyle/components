export async function resolveImage(
  src: string | Blob,
  progress: (v: number) => void
): Promise<Blob> {
  if (typeof src === 'string') {
    progress(Infinity)
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'arraybuffer'
    xhr.open('GET', src)
    xhr.onprogress = (e) => {
      const val = !e.total
        ? Infinity
        : Math.floor((e.loaded / e.total) * 100)
      progress(val)
    }
    xhr.send()
    const data = await new Promise<Blob | undefined>((resolve) => {
      xhr.onload = () =>
        resolve(new Blob([xhr.response || ''], { type: 'image/webp' }))
      xhr.onerror = () => resolve(undefined)
    })

    if (!data) {
      throw new Error('Failed to load image')
    }

    return data
  } else {
    return src
  }
}

export function clean(objectUrl?: any) {
  typeof objectUrl === 'string' && URL.revokeObjectURL(objectUrl)
  typeof objectUrl === 'object' && (objectUrl = null)
}
