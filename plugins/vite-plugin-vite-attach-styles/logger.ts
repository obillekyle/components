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
  B: '\x1b[1m',
  U: '\x1b[4m',
  S: '\x1b[9m',
  I: '\x1b[3m',
  R: '\x1b[0m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
}

export class Logger {
  constructor(private name: string) {}

  private format(message: string): string {
    return message.replace(/(\$\w+);/g, (match) => {
      return formats[match.replace(/[$;]/g, '')] || match
    })
  }

  get prefix() {
    return this.format(`$cyan;[vite:${this.name}]$R;`)
  }

  log(...messages: string[]) {
    console.log(
      this.prefix +
        this.format('$green; ' + messages.map(this.format).join(' '))
    )
  }

  error(...messages: string[]) {
    console.error(
      this.prefix + this.format('$red; ' + messages.map(this.format).join(' '))
    )
  }

  success = this.log
}

export default Logger
