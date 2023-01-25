import { Antibiogo } from './msf'

export { tf } from 'tfjs'
export * from './core'
export { Config, defaultConfig } from './config'

export * as msf from './msf'

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'Antibiogo', { value: Antibiogo })
}
