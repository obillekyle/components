let idIncrement = 0

export function getUnique(prefix: string): string
export function getUnique(): number
export function getUnique(prefix?: string) {
  return prefix ? `${prefix}${idIncrement++}` : idIncrement++
}

export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function inRange(
  value: number,
  min: number,
  max: number,
  excludeLimit = false
) {
  if (excludeLimit) return value > min && value < max
  return value >= min && value <= max
}

export function mapNumberToRange(
  number: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number
): number {
  return (
    ((number - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin
  )
}

export function findNearestNumber(
  number: number,
  numbers: number[]
): number | undefined {
  let nearestNumber: number | undefined
  let minDifference: number = Number.POSITIVE_INFINITY

  for (const number_ of numbers) {
    const difference = Math.abs(number - number_)
    if (difference < minDifference) {
      minDifference = difference
      nearestNumber = number_
    }
  }

  return nearestNumber
}

export function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(max, number))
}

/** @deprecated */
export const minMax = clamp

export function toFileSize(value: number, type: 'bit' | 'byte'): string {
  const units = ['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']
  const divider = type === 'byte' ? 1024 : 1000

  let unitIndex = 0
  while (value >= divider) {
    value /= divider
    unitIndex++
  }

  const unit = units[unitIndex]
  const suffix = type == 'byte' ? unit.toUpperCase() : unit

  return `${value.toFixed(0)} ${suffix}`
}

toFileSize.bits = (value: number) => toFileSize(value, 'bit')
toFileSize.bytes = (value: number) => toFileSize(value, 'byte')
