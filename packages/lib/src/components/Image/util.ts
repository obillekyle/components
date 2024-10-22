type Props = {
  src?: string
  [key: string]: any
}

export function getSrc(props: Props): string {
  return (props.src ?? '').replaceAll(/\[(\w+)]/g, (match, prop) =>
    String(props[prop] || match)
  )
}
