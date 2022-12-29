import { Antibiogo } from './msf'

export { tf } from 'tfjs'
export * from './core'
export { Config, isConfig, defaultConfig } from './config'

Object.defineProperty(window, 'Antibiogo', { value: Antibiogo })
