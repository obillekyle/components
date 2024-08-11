export function toVar(
  key: string | String,
  value?: String | string | number
): `var(--${string})` {
  const value_ = value ? ', ' + value : ''
  return `var(--${key}${value_})`
}

type CanBeNumberFN = {
  (value: number): true
  (value: string | number | String): boolean
}

export const canBeNumber: CanBeNumberFN = function canBeNumber(value): any {
  if (typeof value === 'number') return true
  return /^-?\d+(\.\d+)?$/.test(String(value))
}

/** @deprecated use `canBeNumber` instead */
export const isNumberString = canBeNumber
