import { canBeNumber } from '../css/main'
import { CustomEventHandler } from '../event'
import { evaluate } from '../function/evaluate'
import { getUnique } from '../number/random'
import { assert } from '../object/is'
import { mergeObject } from '../object/merge'

type ComponentID = number | string
type ComponentManagerEvents<T> = {
  open: [key: ComponentID, component: T]
  close: [key: ComponentID]
  change: undefined
  modify: [key: ComponentID, newComponent: T, oldComponent: T]
}

type WithID<T> = T & { id: ComponentID }
type ModifyParam<T> = Partial<T> | ((old: WithID<T>) => Partial<T>)

type ComponentOptions<T> = {
  defaults?: Partial<T>
  startIncrement?: number
}

export type UtilityFunction<T> = {
  id: ComponentID
  close: () => void
  modify: (newComponent: ModifyParam<T>) => void
}

export class ComponentManager<T extends object> extends CustomEventHandler<
  ComponentManagerEvents<T>
> {
  private options: ComponentOptions<T> = {}

  private get INCREMENT_START() {
    return this.options.startIncrement ?? 1000
  }

  private get DEFAULTS() {
    return this.options.defaults ?? {}
  }

  private store = new Map<ComponentID, T>()

  private get nextKey() {
    return this.INCREMENT_START + getUnique()
  }

  constructor(options: ComponentOptions<T> = {}) {
    super()
    this.options = options
  }

  static get DEFAULT_UTILITY(): UtilityFunction<unknown> {
    return {
      id: Number.NaN,
      close: () => {},
      modify: () => {}
    }
  }

  open(component: T): number
  open<K extends ComponentID>(key: K, component: T): K
  open(key: T | ComponentID, component?: T) {
    if (typeof key === 'object') {
      component = key
      key = this.nextKey
    }

    if (this.has(key)) return key

    assert(component, 'Component is not defined')
    const data = mergeObject(this.DEFAULTS, component)

    this.store.set(key, data)
    this.emit('open', key, data)
    this.emit('change')
    return key
  }

  has(key: ComponentID) {
    return this.store.has(key)
  }

  modify(id: ComponentID, component: ModifyParam<T>) {
    if (!this.has(id)) return
    const oldComponent = this.store.get(id)!
    const newComponent = evaluate(component, { ...oldComponent, id })
    this.store.set(id, Object.assign({}, oldComponent, newComponent))

    this.emit('modify', id, this.store.get(id)!, oldComponent)
    this.emit('change')
  }

  close(key: ComponentID) {
    this.store.delete(key)
    this.emit('close', key)
    this.emit('change')
  }

  utility(key: ComponentID): UtilityFunction<T> {
    key = canBeNumber(key) ? Number(key) : key
    return {
      id: key,
      close: () => this.close(key),
      modify: (component) => this.modify(key, component)
    }
  }

  clear() {
    this.store.clear()
    this.emit('change')
  }

  get data(): { [key: ComponentID]: T } {
    return Object.fromEntries(this.store.entries())
  }
}

export default ComponentManager
