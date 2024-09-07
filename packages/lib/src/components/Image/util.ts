import type { Reactive, Ref } from 'vue'

const store: Map<string, Blob> = new Map()

export async function resolveImage(
  source: string,
  progress: (v: number) => void
): Promise<Blob> {
  if (store.has(source)) {
    progress(100)
    return store.get(source)!
  }

  progress(Infinity)

  const xhr = new XMLHttpRequest()
  xhr.responseType = 'blob'
  xhr.open('GET', source)

  xhr.addEventListener('progress', ({ total, loaded }) => {
    progress(total ? Math.floor((loaded / total) * 100) : Infinity)
  })

  xhr.send()

  const data = await new Promise<Blob | void>((resolve) => {
    xhr.addEventListener('error', () => resolve())
    xhr.addEventListener('load', () => resolve(xhr.response))
  })

  if (!data) {
    throw new Error('Failed to load image')
  }

  store.set(source, data)
  return data
}

type ImageProps = {
  width?: number
  height?: number
  size?: number
  src?: string
}

export type Status = {
  progress: number
  error: boolean
  visible: boolean
}

export async function getData(
  props: ImageProps,
  image: Ref<string>,
  status: Reactive<Status>
) {
  if (!props.src) return
  status.error = false
  URL.revokeObjectURL(image.value)
  image.value = ''

  const source = props.src.replaceAll(/\[(\w+)]/g, (match, prop) =>
    String((props as any)[prop] || match)
  )

  try {
    const data = await resolveImage(source, (e) => (status.progress = e))
    image.value = URL.createObjectURL(data)
  } catch {
    status.error = true
  }
}
