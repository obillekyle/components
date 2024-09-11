export function trimDecimalZeros(value: string): string {
  return value.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
}

export function toDecimalFixed(value: number, digits: number) {
  return Number.parseFloat(value.toFixed(digits))
}
