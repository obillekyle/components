import { is } from '../object/is'

export type ObjectValue = {
  value: number | string
  label: any
}

export type MixedValues = (string | number | ObjectValue)[]

export function toObjectValue(values: MixedValues = []): ObjectValue[] {
  return values.map((value) =>
    is(value, 'object')
      ? value
      : {
          value,
          label: String(value)
        }
  )
}
