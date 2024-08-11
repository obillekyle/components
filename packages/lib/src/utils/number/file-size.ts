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
