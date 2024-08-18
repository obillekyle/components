type EvaluateFunction = {
  <T, O extends any, V = O extends () => any ? ReturnType<O> : O>(
    this: T,
    object: O,
    ...args_: V extends (this: T, ...args_: infer P) => any ? P : any
  ): V
}

export const evaluate: EvaluateFunction = function (o, ...p) {
  return typeof o === 'function' ? o.call(this, ...p) : o
}
