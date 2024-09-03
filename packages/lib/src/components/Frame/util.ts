export function toSvgMask(size: number, path: string) {
  return `url('
  data:image/svg+xml;utf8,
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
    <path d="${path}" fill="white"/>
  </svg>
  ')`.replaceAll(/\s+/g, ' ')
}
