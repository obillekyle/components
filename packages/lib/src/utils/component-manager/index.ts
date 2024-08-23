import { CustomEventHandler } from '../event'
import { evaluate } from '../function/evaluate'
import { getUnique } from '../number/random'
import { assert } from '../object/is'
import { mergeObject } from '../object/merge'

type ComponentManagerEvents<T> = {
  open: [key: number, component: T]
  close: [key: number]
  change: undefined
  modify: [key: number, newComponent: T, oldComponent: T]
}

type WithID<T> = T & { id: number }
type ModifyParam<T> = Partial<T> | ((old: WithID<T>) => Partial<T>)

type ComponentOptions<T> = {
  defaults?: Partial<T>
  startIncrement?: number
}

export type UtilityFunction<T> = {
  id: number
  close: () => void
  modify: (newComponent: ModifyParam<T>) => void
}

export class ComponentManager<T extends object> extends CustomEventHandler<
  ComponentManagerEvents<T>
> {
  private options: ComponentOptions<T> = {}

  get INCREMENT_START() {
    return this.options.startIncrement ?? 1000
  }

  get DEFAULTS() {
    return this.options.defaults ?? {}
  }

  private store: Record<number, T> = {}
  private get nextKey() {
    return this.INCREMENT_START + getUnique()
  }

  constructor(options: ComponentOptions<T> = {}) {
    super()
    this.options = options
  }

  open(component: T): number
  open(key: number, component: T): number
  open(key: T | number, component?: T) {
    if (typeof key === 'object') {
      component = key
      key = this.nextKey
    }

    if (this.has(key)) return key

    assert(component, 'Component is not defined')
    const data = mergeObject(this.DEFAULTS, component)

    this.store[key] = data
    this.emit('open', key, data)
    this.emit('change')
    return key
  }

  has(key: number) {
    return key in this.store
  }

  modify(id: number, component: ModifyParam<T>) {
    if (!this.has(id)) return
    const oldComponent = this.store[id]
    const newComponent = evaluate(component, { ...this.store[id], id })
    this.store[id] = Object.assign({}, this.store[id], newComponent)

    this.emit('modify', id, this.store[id], oldComponent)
    this.emit('change')
  }

  close(key: number) {
    delete this.store[key]
    this.emit('close', key)
    this.emit('change')
  }

  utility(key: number): UtilityFunction<T> {
    return {
      id: Number(key),
      close: () => this.close(key),
      modify: (component: ModifyParam<T>) => this.modify(key, component)
    }
  }

  clear() {
    this.store = {}
  }

  get data() {
    return { ...this.store }
  }
}
