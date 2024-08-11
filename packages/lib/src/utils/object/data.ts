export function dataURLtoBlob(dataURL: string): Blob | undefined {
  const dataURLRegex = /^data:([^,;]+);base64,(.*)$/
  const match = dataURL.match(dataURLRegex)

  if (!match) return undefined

  const mimeType = match[1]
  const base64Data = match[2]

  const byteCharacters = atob(base64Data)
  const byteNumbers = Array.from<number>({ length: byteCharacters.length })
  for (let index = 0; index < byteCharacters.length; index++) {
    byteNumbers[index] = byteCharacters.codePointAt(index) ?? 0
  }
  const byteArray = new Uint8Array(byteNumbers)

  const blob = new Blob([byteArray], { type: mimeType })
  return blob
}

export function clean(objectUrl?: string) {
  typeof objectUrl === 'string' &&
    objectUrl.startsWith('blob:') &&
    URL.revokeObjectURL(objectUrl)
}
