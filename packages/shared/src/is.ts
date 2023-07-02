import type { PTextNode } from '@plasticine/types'

export function isObject(target: any) {
  return target !== null && typeof target === 'object' && !isArray(target)
}

export function isArray(target: any): target is any[] {
  return Array.isArray(target)
}

export function isPTextNode(target: any): target is PTextNode {
  return typeof target === 'string' || typeof target === 'number'
}
