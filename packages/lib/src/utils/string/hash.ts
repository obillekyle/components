export function hashStr(string_: string, limit?: number) {
  let hash = 5381
  for (let index = 0; index < string_.length; index++) {
    hash = (hash * 33) ^ (string_.codePointAt(index) ?? 0)
  }
  return (hash >>> 0).toString(16).slice(0, limit)
}
