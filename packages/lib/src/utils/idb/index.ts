/* eslint-disable unicorn/prefer-add-event-listener */

import { CustomEventHandler } from '@/utils/event'
import { FrameQueue } from '../other/frame-queue'

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
  private static instance: IDBStorage | undefined

  private constructor() {
    super()
    IDBStorage.openDB()
    IDBStorage.setupBroadcastListener()
  }

  public static init() {
    return (IDBStorage.instance ??= new IDBStorage())
  }

  public static get addEventListener() {
    return IDBStorage.init().addEventListener
  }

  public static get removeEventListener() {
    return IDBStorage.init().removeEventListener
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
      IDBStorage.instance?.emit(type, data)
    }
  }

  private static broadcast(data: BroadcastUpdate) {
    IDBStorage.broadcastChannel.postMessage(data)
  }

  public static async getItem(key: string): Promise<any> {
    await IDBStorage.isReady()

    return await new Promise((resolve, reject) => {
      if (!IDBStorage.db) {
        return reject('IndexedDB not initialized')
      }

      const transaction = IDBStorage.db.transaction(
        [IDBStorage.storeName],
        'readonly'
      )
      const store = transaction.objectStore(IDBStorage.storeName)
      const request = store.get(key)

      request.onsuccess = () => {
        resolve(request.result ? request.result.value : undefined)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  public static async setItem(key: string, value: any): Promise<void> {
    await IDBStorage.isReady()

    return new Promise((resolve, reject) => {
      if (!IDBStorage.db) {
        return reject('IndexedDB not initialized')
      }

      const transaction = IDBStorage.db.transaction(
        [IDBStorage.storeName],
        'readwrite'
      )
      const store = transaction.objectStore(IDBStorage.storeName)
      const request = store.put({ key, value })

      request.onsuccess = () => {
        IDBStorage.broadcast({ type: 'storage', key })
        IDBStorage.instance?.emit('item-set', { key, value })
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  public static async removeItem(key: string): Promise<void> {
    await IDBStorage.isReady()

    return new Promise((resolve, reject) => {
      if (!IDBStorage.db) {
        return reject('IndexedDB not initialized')
      }

      const transaction = IDBStorage.db.transaction(
        [IDBStorage.storeName],
        'readwrite'
      )
      const store = transaction.objectStore(IDBStorage.storeName)
      const request = store.delete(key)

      request.onsuccess = () => {
        IDBStorage.broadcast({ type: 'storage', key })
        IDBStorage.instance?.emit('item-removed', { key })
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  public static async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!IDBStorage.db) {
        return reject('IndexedDB not initialized')
      }

      const transaction = IDBStorage.db.transaction(
        [IDBStorage.storeName],
        'readwrite'
      )
      const store = transaction.objectStore(IDBStorage.storeName)
      const request = store.clear()

      request.onsuccess = () => {
        IDBStorage.broadcast({ type: 'store-cleared' })
        IDBStorage.instance?.emit('store-cleared')
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  public static isReady(): Promise<void> {
    return new Promise((resolve) => {
      function hasData() {
        if (IDBStorage.db) {
          resolve()
          FrameQueue.remove(hasData)
        }
      }
      FrameQueue.add(hasData)
    })
  }
}
