let idIncrement = 0

export function getUnique(): number
export function getUnique(prefix: string): string
export function getUnique(prefix?: string) {
  return prefix ? prefix + idIncrement++ : idIncrement++
}

export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
