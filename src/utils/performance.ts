import { evaluate } from './object'

type ThrottlerStore = Record<string, number>
type ThrottlerOptions = {
  key: string
  wait?: number
  ignore?: boolean
  endCall?: (() => any) | boolean
}

const throttlerStore: ThrottlerStore = {}

export function throttler(
  callback: () => any,
  options: ThrottlerOptions
): void {
  const key = options.key
  const wait = options.wait ?? 1000
  const ignore = options.ignore ?? false
  const endCall = options.endCall === true ? callback : options.endCall

  if (ignore) return evaluate(callback)

  const currentTime = Date.now()
  const oldTime = throttlerStore[key]

  if (oldTime && currentTime - oldTime < wait) return

  throttlerStore[key] = currentTime
  evaluate(callback)

  if (endCall) {
    debounce(
      function () {
        delete throttlerStore[key]
        evaluate(endCall)
      },
      { key, wait, ignore: true }
    )
  }
}

type TimingStore = Record<string | number, number>
const intervalStore: TimingStore = {}
let intervalID = 0

type IntervalOptions<T> = {
  key?: T
  time: number
}

export function interval<T extends number | string = number>(
  callback: (key: T) => any,
  options: IntervalOptions<T>
): T
export function interval(
  callback: (key: any) => any,
  { key, time }: IntervalOptions<any>
): string | number | undefined {
  key ??= intervalID++

  intervalStore[key] && clearInterval(intervalStore[key])
  intervalStore[key] = setInterval(() => evaluate(callback, key), time)

  return key
}

export function removeInterval(key: string | number) {
  intervalStore[key] && clearInterval(intervalStore[key])
  delete intervalStore[key]
}

const debounceStore: TimingStore = {}
let debounceID = 0

type DebounceOptions<T> = {
  key?: T
  wait?: number
  ignore?: boolean
}

export function debounce<T extends number | string = number>(
  callback: (key: T) => any,
  options?: DebounceOptions<T>
): T
export function debounce(
  callback: (key: any) => any,
  options: DebounceOptions<any> = {}
): string | number {
  const id = options.key ?? debounceID++
  const wait = options.wait ?? 1000
  const ignore = options.ignore ?? false

  if (ignore && debounceStore[id]) evaluate(callback, id)
  if (debounceStore[id]) clearTimeout(debounceStore[id])

  debounceStore[id] = setTimeout(() => {
    evaluate(callback, id)
    delete debounceStore[id]
  }, wait)

  return id
}
