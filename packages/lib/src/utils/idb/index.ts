/* eslint-disable unicorn/prefer-add-event-listener */

import { CustomEventHandler } from '@/utils/event'
import { assert } from '@/utils/object/is'
import { FrameQueue } from '@/utils/other/frame-queue'

type StorageEvents = {
  storage: [{ key: string }]
  'item-set': [{ key: string; value: any }]
  'item-removed': [{ key: string }]
  'store-cleared': undefined
}

type BroadcastUpdate =
  | {
      type: 'store-cleared'
    }
  | {
      type: 'storage'
      key: string
    }

export class IDBStorage extends CustomEventHandler<StorageEvents> {
  private static dbName = 'md-db'
  private static storeName = 'md-db-store'
  private static db: IDBDatabase | undefined
  private static broadcastChannel = new BroadcastChannel('md-db-updates')
  private static _instance: IDBStorage | undefined

  private constructor() {
    super()
    IDBStorage.openDB()
    IDBStorage.setupBroadcastListener()
  }

  private static get instance() {
    return (IDBStorage._instance ??= new IDBStorage())
  }

  private static async getStore(mode: 'readonly' | 'readwrite') {
    await IDBStorage.waitForDB()
    assert(IDBStorage.db, 'IndexedDB not initialized')

    return IDBStorage.db
      .transaction([IDBStorage.storeName], mode)
      .objectStore(IDBStorage.storeName)
  }

  public static get addEventListener() {
    return this.instance.addEventListener.bind(this.instance)
  }

  public static get removeEventListener() {
    return this.instance.removeEventListener.bind(this.instance)
  }

  private static openDB() {
    const request = indexedDB.open(IDBStorage.dbName, 1)

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(IDBStorage.storeName)) {
        db.createObjectStore(IDBStorage.storeName, { keyPath: 'key' })
      }
    }

    request.onsuccess = (event: Event) => {
      IDBStorage.db = (event.target as IDBOpenDBRequest).result
    }

    request.onerror = (event: Event) => {
      console.error(
        'Failed to open IndexedDB',
        (event.target as IDBRequest).error
      )
    }
  }

  private static setupBroadcastListener() {
    IDBStorage.broadcastChannel.onmessage = (event) => {
      const { type, ...data } = event.data
      IDBStorage._instance?.emit(type, data)
    }
  }

  private static broadcast(data: BroadcastUpdate) {
    IDBStorage.broadcastChannel.postMessage(data)
  }

  public static async getItem(key: string): Promise<any> {
    const store = await IDBStorage.getStore('readonly')
    const request = store.get(key)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result?.value)
      request.onerror = () => reject(request.error)
    })
  }

  public static async setItem(key: string, value: any): Promise<void> {
    const store = await IDBStorage.getStore('readwrite')
    const request = store.put({ key, value })

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        IDBStorage.broadcast({ type: 'storage', key })
        IDBStorage._instance?.emit('item-set', { key, value })
        resolve()
      }

      request.onerror = () => reject(request.error)
    })
  }

  public static async hasItem(key: string): Promise<boolean> {
    const store = await IDBStorage.getStore('readonly')
    const request = store.get(key)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(!!request.result)
      request.onerror = () => reject(request.error)
    })
  }

  public static async removeItem(key: string): Promise<void> {
    const store = await IDBStorage.getStore('readwrite')
    const request = store.delete(key)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        IDBStorage.broadcast({ type: 'storage', key })
        IDBStorage._instance?.emit('item-removed', { key })
        resolve()
      }

      request.onerror = () => reject(request.error)
    })
  }

  public static async clear(): Promise<void> {
    const store = await IDBStorage.getStore('readwrite')
    const request = store.clear()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        IDBStorage.broadcast({ type: 'store-cleared' })
        IDBStorage._instance?.emit('store-cleared')
        resolve()
      }

      request.onerror = () => reject(request.error)
    })
  }

  public static async waitForDB(): Promise<void> {
    if (IDBStorage.instance && IDBStorage.db) return

    return new Promise((resolve) => {
      function hasData() {
        if (IDBStorage.db) {
          FrameQueue.remove(hasData)
          resolve()
        }
      }
      FrameQueue.add(hasData)
    })
  }
}
