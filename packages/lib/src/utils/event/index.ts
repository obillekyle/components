type CustomEventCallback<T extends any[] | undefined> = T extends any[]
  ? ((...args: T) => any) | (() => any)
  : () => any

export type EventType = {
  [key: string]: any[] | undefined
}

export type EventStore = {
  [key: string]: Map<(...args: any) => any, AddEventOptions>
}

export type AddEventOptions = {
  once?: boolean
}

export class CustomEventHandler<Events extends EventType = {}> {
  private events: EventStore = {}

  addEventListener<EK extends keyof Events | (string & {})>(
    type: EK,
    callback: EK extends keyof Events
      ? CustomEventCallback<Events[EK]>
      : () => any,
    options?: AddEventOptions
  ): void
  addEventListener(
    type: string,
    callback: () => any,
    options?: AddEventOptions
  ): void {
    this.events[type] ??= new Map()

    this.events[type].has(callback) ||
      this.events[type].set(callback, options || {})
  }

  dispatchEvent<EK extends keyof Events | (string & {})>(
    event: EK,
    ...args: EK extends keyof Events
      ? Events[EK] extends any[]
        ? Events[EK]
        : []
      : any[]
  ): void
  dispatchEvent(type: string, ...args: any[]): void {
    const events = this.events[type]

    if (!events) return

    for (const [callback, options] of events) {
      if (options.once) events.delete(callback)
      callback.call(this, ...args)
    }
  }

  removeEventListener<EK extends keyof Events | (string & {})>(
    type: EK,
    callback: EK extends keyof Events
      ? CustomEventCallback<Events[EK]>
      : () => any
  ): boolean
  removeEventListener(type: string, callback: () => any) {
    const events = this.events[type]
    return events && events.delete(callback)
  }

  emit = this.dispatchEvent
  on = this.addEventListener
  listen = this.addEventListener
  attach = this.addEventListener
  detach = this.removeEventListener

  removeAllEvents() {
    this.events = {}
  }
}
