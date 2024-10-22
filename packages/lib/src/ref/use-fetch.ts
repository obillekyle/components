/* eslint-disable unicorn/prefer-add-event-listener */
import type { MaybeFunction } from '@/utils/function/types'
import type { Ref } from 'vue'

import { computed, onUnmounted, reactive, shallowRef, watch } from 'vue'
import { modifiedComputed, toProxy } from './tools'

type FetchResult<T> =
  | {
      data: undefined
      error: false
      loading: true
      ready: false
      progress: number
      refetch: () => Promise<T>
    }
  | {
      data: T
      ready: true
      error: false
      loading: false
      progress: number
      refetch: () => Promise<T>
    }
  | {
      data: undefined
      ready: false
      error: true
      loading: false
      progress: number
      refetch: () => Promise<T>
    }
  | {
      data: undefined
      ready: false
      error: false
      loading: false
      progress: number
      refetch: () => Promise<T>
    }

type FetchInit = {
  withCredentials?: boolean
  headers?: Record<string, string>
  cache?: boolean
  init?: boolean
}

type URLType = MaybeFunction<string> | Ref<string>

// prettier-ignore
type UseFetch = {
  (url: URLType, type: 'blob', init?: FetchInit): FetchResult<Blob>
  (url: URLType, type: 'text' | 'url-blob', init?: FetchInit): FetchResult<string>
  <T>(url: URLType, type?: 'json' | (string & {}), init?: FetchInit): FetchResult<T>
}

const memoryCache = new Map<string, any>()

export const useFetch: UseFetch = (
  url: URLType,
  type = 'json',
  init: FetchInit = {}
): any => {
  let xhr: XMLHttpRequest
  let doFetch = init.init ?? true
  const cache = init.cache ?? true

  const data = shallowRef()
  const status = reactive({
    ready: false,
    error: false,
    loading: false,
    progress: -1
  })

  const src = modifiedComputed(url)

  async function request() {
    const url = src.value
    const id = `${type}:${url}`
    status.loading && xhr?.abort()

    if (!doFetch) {
      doFetch = true
      return
    }

    status.ready = false
    status.error = false
    status.loading = true
    status.progress = -1

    if (cache && memoryCache.has(id)) {
      data.value = memoryCache.get(id)

      status.ready = true
      status.loading = false
      status.progress = 100
      return
    }

    xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)

    xhr.withCredentials = init?.withCredentials ?? false
    xhr.responseType = type === 'url-blob' ? 'blob' : (type as any)
    for (const [key, value] of Object.entries(init?.headers || {})) {
      xhr.setRequestHeader(key, value)
    }

    xhr.onprogress = ({ loaded, total }) => {
      status.progress = (total ? loaded / total : 0) * 100
    }

    xhr.onload = () => {
      switch (type) {
        case 'json':
        case 'text':
        case 'blob': {
          data.value = xhr.response
          break
        }
        case 'url-blob': {
          data.value && URL.revokeObjectURL(data.value)
          data.value = URL.createObjectURL(xhr.response)
          break
        }
        default: {
          console.error('Invalid useFetch data type')
          status.loading = false
          status.error = true
          return
        }
      }

      const cacheHeader = xhr.getResponseHeader('Cache-Control') ?? ''

      if (cache && !['no-cache', 'no-store'].includes(cacheHeader))
        memoryCache.set(id, data.value)

      status.ready = true
      status.loading = false
      status.progress = 100
    }

    xhr.onerror = () => {
      status.error = true
      status.loading = false
    }

    xhr.send()
  }

  watch(src, request, { immediate: true })
  onUnmounted(() => {
    type === 'url-blob' && !cache && URL.revokeObjectURL(data.value)
    xhr?.abort()
  })

  return toProxy(
    computed(() =>
      Object.assign({}, status, {
        refetch: request,
        data: data.value
      })
    )
  )
}
