import type { AsyncPipeFunction, PipeFunction } from './type'

export const pipe: PipeFunction = (v: any, ...fns: Function[]) => {
  let result = v
  for (const fn of fns) {
    result = fn(result)
  }
  return result
}

export const asyncPipe: AsyncPipeFunction = async (
  v: any,
  ...fns: Function[]
) => {
  let result = v
  for (const fn of fns) {
    result = await fn(result)
  }
  return result
}
