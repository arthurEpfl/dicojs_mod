import { Antibiogo } from './msf'

export * from './core'
export * as browser from './imports'
export { CONFIG } from './config'

Object.defineProperty(window, 'Antibiogo', { value: Antibiogo })
