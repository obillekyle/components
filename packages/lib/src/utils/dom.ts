/* eslint-disable unicorn/no-null */
import '@/assets/ripple.scss'
import { addPX } from './css'

export function $<T extends Element = HTMLElement>(
  selector: string,
  element?: Element | EventTarget | null
): T | null {
  return ((element as Element) || document).querySelector(selector)
}

export function getParent(
  element: HTMLElement | null,
  selector: string,
  self?: boolean,
  deep = 10
): HTMLElement | null {
  if (deep <= 0 || !element) return null
  if (self && element.matches(selector)) return element

  return getParent(element.parentElement, selector, true, deep - 1)
}

export function onSelfEvent<T extends Event>(
  event: T,
  handler: (event: T) => any
) {
  const target = event.target as HTMLElement
  const currentTarget = event.currentTarget as HTMLElement

  if (target === currentTarget) handler(event)
}

export async function openFilePickerAsync(): Promise<File | null>
export async function openFilePickerAsync(options: {
  accept?: string
}): Promise<File | null>
export async function openFilePickerAsync(options: {
  accept?: string
  multiple: true
}): Promise<File[] | null>
export async function openFilePickerAsync(
  options: { accept?: string; multiple?: boolean } = {}
) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = options.accept || ''
  input.multiple = options.multiple ?? false

  return new Promise<File | File[] | null>((resolve) => {
    input.addEventListener('change', function () {
      resolve(
        options.multiple
          ? [...(input.files || [])]
          : input.files?.[0] || null
      )
      this.removeEventListener('change', input.onchange!)
    })
    input.click()
  })
}

export function openFilePicker(callback: (file: File | null) => any): void
export function openFilePicker(
  callback: (file: File | null) => any,
  options: { accept?: string }
): void
export function openFilePicker(
  callback: (file: File[]) => any,
  options: { accept?: string; multiple: true }
): void
export function openFilePicker(
  callback: (file: any) => any,
  options: { accept?: string; multiple?: boolean } = {}
) {
  openFilePickerAsync(options).then((file) => callback(file)?.then?.())
}

export function rippleEffect(e: PointerEvent, to?: string) {
  const target = e.currentTarget as HTMLElement
  const element = to ? $(to, target) || target : target

  if ('disabled' in element && element.disabled) return
  if (e.pointerType === 'mouse' && e.button === 2) return

  const rect = element.getBoundingClientRect()
  const ripple = document.createElement('span')

  ripple.className = 'md-ripple'
  ripple.style.left = addPX(e.clientX - rect.left)
  ripple.style.top = addPX(e.clientY - rect.top)
  ripple.style.width = addPX(
    rect.height > rect.width ? rect.height : rect.width
  )
  ripple.style.height = ripple.style.width

  function removeRipple() {
    ripple.classList.add('fade')
    ripple.addEventListener('animationend', ripple.remove.bind(ripple))
  }

  document.addEventListener('pointerup', removeRipple)
  document.addEventListener('pointercancel', removeRipple)

  element.append(ripple)
}

export function keyboardClick(event: KeyboardEvent) {
  const target = event.currentTarget as HTMLElement
  if (target.matches(':focus-visible') && event.key === ' ') {
    target.click()
    event.preventDefault()
  }
}

export function getClientPos(event: TouchEvent | MouseEvent) {
  return event instanceof MouseEvent
    ? { x: event.clientX, y: event.clientY }
    : {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      }
}

export function isMobile() {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent
  )
}

export function isInputFocused(): boolean {
  return (
    document.activeElement instanceof HTMLInputElement ||
    document.activeElement instanceof HTMLTextAreaElement
  )
}
