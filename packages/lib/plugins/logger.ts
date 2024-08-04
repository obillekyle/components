/**
 * ```scss
 * $B: bold
 * $U: underline
 * $S: strikethrough
 * $I: italic
 * $R: reset
 * $<color>: (ex: $blue)
 * ```
 */
const formats: Record<string, string> = {
  B: '\u001B[1m',
  U: '\u001B[4m',
  S: '\u001B[9m',
  I: '\u001B[3m',
  R: '\u001B[0m',

  black: '\u001B[30m',
  red: '\u001B[31m',
  green: '\u001B[32m',
  yellow: '\u001B[33m',
  blue: '\u001B[34m',
  magenta: '\u001B[35m',
  cyan: '\u001B[36m',
  white: '\u001B[37m',
  gray: '\u001B[90m'
}

export class Logger {
  constructor(private name: string) {}

  private format(message: string): string {
    return message.replaceAll(/(\$\w+);/g, (match) => {
      return formats[match.replaceAll(/[$;]/g, '')] || match
    })
  }

  get prefix() {
    return this.format(`$cyan;[vite:${this.name}]$R;`)
  }

  log(...messages: string[]) {
    console.log(
      this.prefix +
        this.format(
          '$green; ' +
            messages.map((element) => this.format(element)).join(' ')
        )
    )
  }

  error(...messages: string[]) {
    console.error(
      this.prefix +
        this.format(
          '$red; ' +
            messages.map((element) => this.format(element)).join(' ')
        )
    )
  }

  success = this.log
}

export default Logger
