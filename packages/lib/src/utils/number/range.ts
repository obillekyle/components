export function inRange(
  value: number,
  min: number,
  max: number,
  excludeLimit = false
) {
  return excludeLimit
    ? value > min && value < max
    : value >= min && value <= max
}

export function findNearestNumber(
  number: number,
  numbers: number[]
): number {
  let nearestNumber: number | undefined
  let minDifference: number = Number.POSITIVE_INFINITY

  for (const number_ of numbers) {
    const difference = Math.abs(number - number_)
    if (difference < minDifference) {
      minDifference = difference
      nearestNumber = number_
    }
  }

  return nearestNumber ?? number
}

export function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(max, number))
}

export function offsetRange(
  length: number,
  pos: number,
  offset: number
): number {
  const half = length / 2
  return pos - ((pos - half) / half) * offset
}

export function mapNumberToRange(
  number: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number
): number {
  return clamp(
    ((number - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin,
    newMin,
    newMax
  )
}
