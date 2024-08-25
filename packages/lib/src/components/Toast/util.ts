import type { Component } from 'vue'

export interface ToastProps {
  icon?: string | Component
  message: string | Component
  variant?: 'short' | 'expanded'
}

export const TOAST = {
  DEFAULT_TIMEOUT: 5000
}

export function getFaviconUrl(): string {
  if (typeof document === 'undefined') return '/favicon.ico'
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  return link ? link.href : '/favicon.ico'
}
