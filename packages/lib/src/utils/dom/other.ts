export function isMobile() {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent
  )
}

export function hasFormFocused(): boolean {
  return (
    document.activeElement instanceof HTMLInputElement ||
    document.activeElement instanceof HTMLTextAreaElement ||
    document.activeElement instanceof HTMLSelectElement
  )
}

/** @deprecated use `hasFormFocused` instead */
export const isInputFocused = hasFormFocused
