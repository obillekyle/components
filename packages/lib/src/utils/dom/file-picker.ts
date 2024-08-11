/* eslint-disable unicorn/no-null */
// prettier-ignore
type FilePickerAsync = {
  (): Promise<File | null>
  (options: { accept?: string }): Promise<File | null>
  (options: { accept?: string; multiple: true }): Promise<File[] | null>
  (options: { accept?: string; multiple?: boolean }): Promise<File | File[] | null>
}

export const openFilePickerAsync: FilePickerAsync =
  async function openFilePickerAsync(options: any = {}): Promise<any> {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = options.accept || ''
    input.multiple = options.multiple ?? false

    return new Promise<File | File[] | null>((resolve) => {
      function resolver() {
        resolve(
          options.multiple
            ? [...(input.files || [])]
            : input.files?.[0] || null
        )
      }

      input.addEventListener('change', resolver, { once: true })
      input.click()
    })
  }

// prettier-ignore
type FilePicker = {
  (handler: (file: File | null) => any): void
  (handler: (file: File | null) => any, options: { accept?: string }): void
  (handler: (file: File[]) => any, options: { accept?: string; multiple: true }): void
  (handler: (file: any) => any, options: { accept?: string; multiple?: boolean }): void
}

export const openFilePicker: FilePicker = (handler, options: any = {}) => {
  openFilePickerAsync(options).then((file) => handler(file))
}
