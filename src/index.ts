import { Antibiogo } from './msf'

export * from './core'
export { Config, isConfig, defaultConfig } from './config'

Object.defineProperty(window, 'Antibiogo', { value: Antibiogo })
