export function trimDecimalZeros(value: string): string {
  return value.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
}

export function toDecimalFixed(value: number, digits = 0) {
  const factor = Math.pow(10, digits)
  return Math.round(value * factor) / factor
}
