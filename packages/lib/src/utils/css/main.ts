export function toVar(key: string, value?: string | number): string {
  value = value ? ', ' + value : ''
  return `var(--${key + value})`
}

export function canBeNumber(value: any): value is number | `${number}`
export function canBeNumber(value: any) {
  return /^-?\d+(\.\d+)?$/.test(String(value).trim())
}

export const isVar = (v: string) => /^var\(--.+\)$/.test(v)
export const isNum = canBeNumber
